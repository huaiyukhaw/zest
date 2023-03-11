import { LoaderFunction, ActionFunction, redirect } from "@remix-run/node"
import { json } from "@remix-run/node"
import { setFormDefaults, useControlField, useFormContext, ValidatedForm, validationError } from "remix-validated-form"
import type { FormDefaults } from "remix-validated-form"
import { FormCombobox, FormInput } from "~/components/form"
import type { ComboboxOptions } from "~/components/form"
import { FormMarkdownEditor } from "~/components/form"
import { deletePost, getPostOrThrow, publishPost, unpublishPost, updatePost } from "~/models/post.server"
import { CustomFormProps } from "~/types"
import { postValidator as validator } from "~/validators/post"
import { useState, useEffect, useCallback } from "react"
import { FormHiddenInput } from "~/components/form"
import type { PreviewType } from "@uiw/react-md-editor"
import { Link, useBeforeUnload, useLoaderData, useSearchParams, useSubmit, useTransition } from "@remix-run/react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx"
import { getAllTags } from "~/models/tag.server"

export type PostLoaderData = {
    options: ComboboxOptions
}

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    if (!params.postId) throw new Error("Post id not found")

    const post = await getPostOrThrow(params.postId)
    const tags = await getAllTags(params.profile)

    return json<FormDefaults & PostLoaderData>({
        options: [
            {
                label: "Your recent tags",
                options: tags
            }
        ],
        ...setFormDefaults("editPostForm", post)
    });
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    if (!params.postId) throw new Error("Post id not found")

    const form = await request.formData()
    const subaction = form.get("subaction");

    switch (subaction) {
        case "delete":
            await deletePost(params.postId)
            return redirect(`/${params.profile}/edit/posts`)

        case "publish":
            await publishPost(params.postId)
            break;

        case "draft":
            await unpublishPost(params.postId)
            break;

        case "edit":
            const result = await validator.validate(form);

            if (result.error) return validationError(result.error);
            console.log("edit result", result)

            const { title, tags, content, published } = result.data

            await updatePost({
                id: params.postId,
                title,
                tags,
                content,
                published,
                profileUsername: params.profile
            })

        default:
            break;
    }

    return json({})
}

export const PostForm: React.FC<CustomFormProps> = ({
    subaction, formId
}) => {
    const { options } = useLoaderData<PostLoaderData>()
    const [preview, setPreview] = useState<PreviewType>("edit")
    const { defaultValues, getValues } = useFormContext(formId)
    const [searchParams] = useSearchParams()
    const by = searchParams.get("by") ?? undefined
    const published = defaultValues?.published
    const awardId = searchParams.get("awardId") ?? defaultValues?.defaultValues?.awards[0].awardId
    const certificationId = searchParams.get("certificationId") ?? defaultValues?.defaultValues?.certification[0].certificationId
    const educationId = searchParams.get("educationId") ?? defaultValues?.defaultValues?.education[0].educationId
    const exhibitionId = searchParams.get("exhibitionId") ?? defaultValues?.defaultValues?.exhibition[0].exhibitionId
    const featureId = searchParams.get("featureId") ?? defaultValues?.defaultValues?.feature[0].featureId
    const projectId = searchParams.get("projectId") ?? defaultValues?.defaultValues?.project[0].projectId
    const sideProjectId = searchParams.get("sideProjectId") ?? defaultValues?.defaultValues?.sideProject[0].sideProjectId
    const speakingId = searchParams.get("speakingId") ?? defaultValues?.defaultValues?.speaking[0].speakingId
    const volunteeringId = searchParams.get("volunteeringId") ?? defaultValues?.defaultValues?.volunteering[0].volunteeringId
    const workExperienceId = searchParams.get("workExperienceId") ?? defaultValues?.defaultValues?.workExperience[0].workExperienceId
    const writingId = searchParams.get("writingId") ?? defaultValues?.defaultValues?.writing[0].writingId
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
            <ValidatedForm
                validator={validator}
                resetAfterSubmit
                method="post"
                onChange={() => setIsDirty(true)}
                onReset={() => setIsDirty(false)}
                subaction={subaction}
                id={formId}
                className="overflow-y-auto scrollbar-hide flex flex-col h-full flex-1 py-4"
            >
                <div className="dark:bg-gray-700/50 rounded-lg border border-gray-300 dark:border-transparent mb-1">
                    <FormInput
                        name="title"
                        type="text"
                        placeholder="New post title here..."
                        disabled={preview == "preview"}
                        autoFocus
                        hideError
                        transparent
                    />
                    <FormCombobox
                        name="tags"
                        options={options ?? []}
                        hideError
                        onSelect={() => setIsDirty(true)}
                        disabled={preview == "preview"}
                    />
                </div>
                <FormMarkdownEditor
                    name="content"
                    placeholder="Hi"
                    preview={preview}
                    height="100%"
                    toolbarBottom
                    visibleDragbar={false}
                    defaultTabEnable
                    textareaProps={{
                        placeholder: "Write your post content here...",
                    }}
                    hideToolbar={typeof window !== "undefined" && window.innerWidth < 640 ? true : false}
                />
                <FormHiddenInput name="published" value={subaction == "new" ? "true" : published ? "true" : "false"} />
                <FormHiddenInput name="awardId" value={awardId} />
                <FormHiddenInput name="certificationId" value={certificationId} />
                <FormHiddenInput name="educationId" value={educationId} />
                <FormHiddenInput name="exhibitionId" value={exhibitionId} />
                <FormHiddenInput name="featureId" value={featureId} />
                <FormHiddenInput name="projectId" value={projectId} />
                <FormHiddenInput name="sideProjectId" value={sideProjectId} />
                <FormHiddenInput name="speakingId" value={speakingId} />
                <FormHiddenInput name="volunteeringId" value={volunteeringId} />
                <FormHiddenInput name="workExperienceId" value={workExperienceId} />
                <FormHiddenInput name="writingId" value={writingId} />
                <FormHiddenInput name="by" value={by} />
            </ValidatedForm>
            <div className="flex h-16 items-center justify-between gap-1.5">
                <div className="flex items-baseline gap-2">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger>
                            {
                                published ? (
                                    <span className="text-green-500 text-sm font-medium">
                                        &#x2022; Published
                                    </span>
                                ) : (
                                    <span className="text-yellow-500 text-sm font-medium">
                                        &#x2022; Draft
                                    </span>
                                )
                            }
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                side="top"
                                sideOffset={5}
                                align="start"
                                className="
                                radix-side-top:animate-slide-up
                                w-48 rounded-lg p-1 md:w-56 z-50
                                bg-white dark:bg-gray-700
                                border border-gray-200 dark:border-gray-800
                                shadow-[0_4px_40px_rgba(0,0,0,0.2)] dark:shadow-[0_4px_40px_rgba(0,0,0,0.5)]
                            "
                            >
                                <DropdownMenu.Item
                                    className="
                                        w-full flex select-none items-center rounded-md px-2 py-2 text-xs
                                        text-gray-700 dark:text-gray-300 focus:bg-gray-50 dark:focus:bg-gray-800/50
                                    "
                                    onSelect={
                                        () => setPreview((currentPreview) =>
                                            currentPreview === "edit"
                                                ? "preview"
                                                : "edit"
                                        )
                                    }
                                >
                                    {preview === "edit" ? "Preview changes" : "Edit post"}
                                </DropdownMenu.Item>
                                {
                                    (defaultValues !== undefined && Object.values(defaultValues).length > 0) && (
                                        <>
                                            <DropdownMenu.Item
                                                className="
                                                    w-full flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs
                                                    text-gray-700 dark:text-gray-300 focus:bg-gray-50 dark:focus:bg-gray-800/50
                                                    hover:bg-gray-50 dark:hover:bg-gray-800/50
                                                "
                                                onSelect={
                                                    () => {
                                                        submit(
                                                            { subaction: published ? "draft" : "publish" },
                                                            { method: "post", replace: true }
                                                        )
                                                        setIsDirty(false)
                                                    }
                                                }
                                            >
                                                {published ? "Unpublish" : "Publish"}
                                            </DropdownMenu.Item>
                                            <DropdownMenu.Item
                                                className="
                                                    w-full flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-xs
                                                    hover:bg-red-50 dark:hover:bg-red-600/80
                                                    focus:bg-red-50 dark:focus:bg-red-600/80
                                                    dark:hover:text-white dark:focus:text-white
                                                    text-red-700 dark:text-red-600 font-semibold
                                                "
                                                onSelect={
                                                    () => {
                                                        if (confirm("Are you sure you want to delete this item?")) {
                                                            submit(
                                                                { subaction: "delete" },
                                                                { method: "post", replace: true }
                                                            )
                                                        }
                                                    }
                                                }
                                            >
                                                Delete
                                            </DropdownMenu.Item>
                                        </>
                                    )
                                }
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                    {
                        transition.state === "submitting" ? (
                            <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">Saving...</span>
                        ) : null
                    }
                </div>
                <div className="flex gap-1.5">
                    <Link
                        to={by ? `../${by}` : "../posts"}
                        className={
                            clsx(
                                isDirty ? "btn-transparent" : "btn-secondary"
                            )
                        }
                    >
                        Close
                    </Link>
                    {
                        isDirty && (
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
                            >
                                Publish {subaction === "edit" && " edit"}
                            </button>
                        )
                    }
                </div>
            </div>
        </>
    )
}

const PostIdPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <PostForm subaction="edit" formId="editPostForm" />
    )
}

export default PostIdPage