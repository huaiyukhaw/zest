import { useState, useEffect } from "react"
import type { ActionFunction, LoaderFunction, UploadHandler } from "@remix-run/node"
import {
    redirect,
    json,
    unstable_composeUploadHandlers as composeUploadHandlers,
    unstable_createMemoryUploadHandler as createMemoryUploadHandler,
    unstable_parseMultipartFormData as parseMultipartFormData,
} from "@remix-run/node"
import { Form, Link, useLoaderData, useSubmit, useTransition } from "@remix-run/react"
import { FormDefaults, GenericObject, setFormDefaults, useFormContext, ValidatedForm, validationError } from "remix-validated-form"
import { FormImageInput, FormInput, FormTextArea, SubmitButton } from "~/components/form"
import { getProfileByUsernameOrThrow, updateProfile, updateProfileAvatar } from "~/models/profile.server"

import { generalValidator as validator, avatarSchema, avatarValidator } from "~/validators/general"
import { isDeepEqual } from "~/utils/isDeepEqual"
import { deleteImage, uploadImage } from "~/utils"
import { z } from "zod"
import clsx from "clsx"
import type { UploadApiResponse } from "cloudinary";
import { AlertDialog } from "~/components/radix"

type AvatarLoaderData = z.infer<typeof avatarSchema>

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const profile = await getProfileByUsernameOrThrow(params.profile)

    const {
        username,
        displayName,
        jobTitle,
        location,
        pronouns,
        website,
        bio,
        avatar: avatarStr
    } = profile

    let avatar = null

    if (avatarStr) {
        const parsedAvatar = avatarSchema.safeParse({ avatar: avatarStr })
        if (parsedAvatar.success) {
            avatar = parsedAvatar.data.avatar
        }
    }

    return json<FormDefaults & AvatarLoaderData>({
        ...setFormDefaults("profileGeneralForm", {
            username,
            displayName: displayName ?? "",
            jobTitle: jobTitle ?? "",
            location: location ?? "",
            pronouns: pronouns ?? "",
            website: website ?? "",
            bio: bio ?? "",
        }),
        avatar
    })
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const uploadHandler: UploadHandler = composeUploadHandlers(
        async ({ name, data }) => {
            console.log("name", name)
            if (name !== "avatar") {
                return undefined;
            }
            const uploadedImage: UploadApiResponse = await uploadImage(data, name);
            return JSON.stringify({
                id: uploadedImage.public_id,
                url: uploadedImage.secure_url
            });
        },
        createMemoryUploadHandler(),
    );

    const form = await parseMultipartFormData(request, uploadHandler);
    const subaction = form.get("subaction")

    switch (subaction) {
        case "uploadAvatar":
            const { submittedData: { avatar }, error } = await avatarValidator.validate(form)
            if (error) return validationError(error);
            await updateProfileAvatar({ username: params.profile, avatar: avatar ?? null })
            return json({
                avatar: avatar ?? null
            })

        case "removeAvatar":
            await updateProfileAvatar({ username: params.profile, avatar: null })
            const avatarId = form.get("avatarId")
            if (avatarId) {
                await deleteImage(avatarId.toString())
            }
            return json({
                avatar: null
            })

        case "general":
            const result = await validator.validate(form);
            if (result.error) return validationError(result.error);
            const profile = await getProfileByUsernameOrThrow(params.profile)
            const updatedProfile = await updateProfile({ id: profile.id, ...result.data })
            return redirect(`/u/${updatedProfile.username}/edit/`)

        default:
            return redirect(`/u/${params.profile}/edit/`)
    }
}

const AvatarUploader = ({ showSpinner = true }: { showSpinner?: boolean }) => {
    const submit = useSubmit()

    return (
        <ValidatedForm validator={avatarValidator} action="?index&action=avatar" method="post" id="profileAvatarForm" subaction="uploadAvatar" encType="multipart/form-data" onChange={(event) => {
            submit(event.currentTarget)
        }}>
            <FormImageInput name="avatar" className="flex gap-4 items-center justify-start" showSpinner={showSpinner} />
        </ValidatedForm>
    )
}

const AvatarViewer = (avatar: { id: string, url: string }) => {

    const transition = useTransition()
    const isRemovingAvatar = transition.submission && transition.location.search === "?index&action=avatar"

    return (
        <div className="flex gap-4 items-center justify-start">
            <img className="
            group object-cover aspect-ratio h-24 w-24 rounded-full
            flex flex-col items-center justify-center
        "
                src={avatar.url}
                alt="Avatar"
            />
            <Form method="post" encType="multipart/form-data" action="?index&action=avatar">
                <input type="hidden" name="subaction" value="removeAvatar" />
                <input type="hidden" name="avatarId" value={avatar.id} />
                <button className="btn-secondary flex-none relative">
                    <span
                        className={clsx(
                            isRemovingAvatar ? "invisible" : "visible"
                        )}
                    >
                        Remove image
                    </span>
                    <span className={clsx(
                        isRemovingAvatar ? "visible" : "invisible",
                        "absolute inset-0 h-full w-full flex items-center justify-center"
                    )}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="animate-spin w-4 h-4 text-gray-800 dark:text-white"
                        >
                            <path d="M2 11h5v2H2zm15 0h5v2h-5zm-6 6h2v5h-2zm0-15h2v5h-2zM4.222 5.636l1.414-1.414 3.536 3.536-1.414 1.414zm15.556 12.728l-1.414 1.414-3.536-3.536 1.414-1.414zm-12.02-3.536l1.414 1.414-3.536 3.536-1.414-1.414zm7.07-7.071l3.536-3.535 1.414 1.415-3.536 3.535z" />
                        </svg>
                    </span>
                </button>
            </Form>
        </div>
    )
}

const ProfileGeneralPage = () => {
    const { defaultValues, getValues } = useFormContext("profileGeneralForm")
    const [formDefaultValues, setFormDefaultValues] = useState<GenericObject>();
    const [isDirty, setIsDirty] = useState<boolean>(false)

    const { avatar } = useLoaderData<AvatarLoaderData>()

    useEffect(() => {
        const validate = async () => {
            const validatedFormDefaultValues = defaultValues ? (await validator.validate(defaultValues)).data : {}
            setFormDefaultValues(validatedFormDefaultValues);
        };
        if (defaultValues) validate()

    }, [defaultValues]);

    const handleFormChange = async () => {
        const formCurrentValues = await validator.validate(getValues())
        setIsDirty(!isDeepEqual(formCurrentValues.data, formDefaultValues))
    }

    return (
        <>
            <div className="overflow-y-auto scrollbar-hide flex flex-col flex-1 m-1">
                {
                    avatar == null ? (
                        <AvatarUploader />
                    ) : (
                        <AvatarViewer {...avatar} />
                    )
                }
                <ValidatedForm
                    validator={validator}
                    resetAfterSubmit
                    method="post"
                    id="profileGeneralForm"
                    onChange={handleFormChange}
                    onSubmit={async () => {
                        handleFormChange()
                    }}
                    onReset={() => setIsDirty(false)}
                    subaction="general"
                    encType="multipart/form-data"
                    className="pt-4"
                >
                    <FormInput
                        name="username"
                        label="Username*"
                        type="text"
                        placeholder="Your unique @handle"
                        maxLength={15}
                        transform={(value) => value.toLowerCase().trim()}
                    />
                    <FormInput
                        name="displayName"
                        label="Display name*"
                        type="text"
                        placeholder="How your name appears on your profile"
                        maxLength={48}
                    />
                    <FormInput
                        name="jobTitle"
                        label="What do you do?"
                        type="text"
                        placeholder="Software engineer, data scientist, etc"
                        maxLength={24}
                    />
                    <FormInput
                        name="location"
                        label="Location"
                        type="text"
                        placeholder="Where you're based"
                        maxLength={24}
                    />
                    <FormInput
                        name="pronouns"
                        label="Pronouns"
                        type="text"
                        placeholder="They/them, etc"
                        maxLength={12}
                    />
                    <FormInput
                        name="website"
                        label="Website"
                        type="url"
                        placeholder="https://example.com"
                        maxLength={96}
                    />
                    <FormTextArea
                        name="bio"
                        label="About"
                        placeholder="A short bio"
                    />
                </ValidatedForm>
            </div>
            <div className="dialog-footer">
                {
                    isDirty ? <>
                        <button type="reset" className="btn-transparent">
                            Cancel
                        </button>
                        <SubmitButton formId="profileGeneralForm">Save</SubmitButton>
                    </> : (
                        <AlertDialog.Cancel className="btn-secondary">
                            Done
                        </AlertDialog.Cancel>
                        // <Link to="../../" className="btn-secondary">
                        //     Done
                        // </Link>
                    )
                }
            </div>
        </>
    )
}

export default ProfileGeneralPage