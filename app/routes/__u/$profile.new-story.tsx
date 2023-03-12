import { createPost } from "~/models/post.server"
import { safeRedirect } from "~/utils"
import { type LoaderFunction, type ActionFunction, type LinksFunction, json, redirect } from "@remix-run/node"
import { useControlField, useFormContext, ValidatedForm, validationError } from "remix-validated-form"
import { FormInput } from "~/components/form"
import { CustomFormProps } from "~/types"
import { postValidator as validator } from "~/validators/post"
import { useState, useEffect, useCallback } from "react"
import { FormHiddenInput } from "~/components/form"
import { Link, useBeforeUnload, useLoaderData, useSubmit, useTransition } from "@remix-run/react"
import { getProfileByUsername, type Profile } from "~/models/profile.server"
import FormQuillEditor from "~/components/form/FormQuillEditor"
import { requireUserId } from "~/session.server"
import { type EditProfileCatchData } from "./$profile"

import styles from "react-quill/dist/quill.bubble.css";

export const links: LinksFunction = () => [
    { rel: "stylesheet", href: styles },
];

export type StoryLoaderData = {
    profile: Profile,
}

export const loader: LoaderFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const userId = await requireUserId(request);
    const profile = await getProfileByUsername(params.profile)

    if (!profile) throw new Error("Profile username not found")

    if (!profile.userId.includes(userId)) {
        const data: EditProfileCatchData = { profileOwnerEmail: profile.userEmail }
        throw json(data, { status: 401 })
    }

    return json<StoryLoaderData>({
        profile: profile,
    });
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const {
        title,
        tags,
        content,
    } = result.data

    const { slug } = await createPost({
        title: title ?? "Untitled",
        tags,
        content,
        profileUsername: params.profile
    });

    const redirectTo = `/post/${slug}`
    const safeRedirectTo = safeRedirect(redirectTo, `/${params.profile}/posts`);

    return redirect(safeRedirectTo)
}

export const StoryForm: React.FC<CustomFormProps> = ({
    subaction, formId
}) => {
    const { profile } = useLoaderData<StoryLoaderData>()
    const { defaultValues, getValues } = useFormContext(formId)
    const published = defaultValues?.published
    const [isDirty, setIsDirty] = useState<boolean>(false)
    const submit = useSubmit()
    const transition = useTransition();
    const [titleValue] = useControlField<string>("title", formId);
    const [tagsValue] = useControlField<string>("tags", formId);
    const [contentValue] = useControlField<string>("content", formId);

    useEffect(() => {
        if (subaction === "edit") {
            const timer = setTimeout(() => {
                submit(getValues(), { method: "post", replace: true });
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [subaction, titleValue, tagsValue, contentValue])

    return (
        <>
            <div className="bubble flex h-16 items-center justify-between gap-1.5 mx-4">
                <h1 className="text-gray-600 dark:text-gray-300 text-sm font-medium">Draft in&nbsp;
                    <Link to={`/${profile.username}`} className="hover:underline underline-offset-2">{profile.displayName}</Link>
                </h1>
                <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-baseline gap-2">
                        {
                            transition.state === "submitting" ? (
                                <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">Saving...</span>
                            ) : null
                        }
                    </div>
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={async () => {
                            const { submittedData } = await validator.validate(getValues())
                            submit({
                                ...submittedData,
                                published: "true",
                                subaction: "edit",
                            }, { method: "post", replace: true });
                            setIsDirty(false)
                        }}
                        disabled={!isDirty}
                    >
                        Publish {subaction === "edit" && " edit"}
                    </button>
                </div>
            </div>
            <ValidatedForm
                validator={validator}
                resetAfterSubmit
                method="post"
                onChange={() => setIsDirty(true)}
                onReset={() => setIsDirty(false)}
                subaction={subaction}
                id={formId}
                className="flex flex-col h-full flex-1 py-4"
            >
                <div className="rounded-lg mb-3">
                    <FormInput
                        name="title"
                        type="text"
                        placeholder="Title"
                        hideError
                        transparent
                        inputClassName="text-5xl placeholder:text-5xl font-extrabold placeholder:font-normal text-gray-700 dark:text-gray-200"
                    />
                </div>
                <FormQuillEditor
                    placeholder="Write your story..."
                    name="content"
                />
                <FormHiddenInput name="published" value={subaction == "new" ? "true" : published ? "true" : "false"} />
            </ValidatedForm>
        </>
    )
}

const NewStoryPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <div className="max-w-screen-lg mx-auto h-screen flex flex-col">
            <StoryForm subaction="new" formId="newStoryForm" />
        </div>
    )
}

export default NewStoryPage