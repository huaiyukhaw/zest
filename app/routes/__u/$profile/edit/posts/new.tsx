import { json, LoaderFunction, redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createPost } from "~/models/post.server"
import { postValidator as validator } from "~/validators/post"
import { PostForm } from "./$postId"
import type { PostLoaderData } from "./$postId"
import { safeRedirect } from "~/utils"
import { useBeforeUnload } from "@remix-run/react"
import { useCallback } from "react"
import { getAllTagsByProfileUsername } from "~/models/tag.server"

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const tags = await getAllTagsByProfileUsername(params.profile)

    return json<PostLoaderData>({
        options: [
            {
                label: "Your recent tags",
                options: tags
            }
        ],
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
        by,
        awardId,
        certificationId,
        educationId,
        exhibitionId,
        featureId,
        projectId,
        sideProjectId,
        speakingId,
        volunteeringId,
        workExperienceId,
        writingId,
    } = result.data

    await createPost({
        title: title ?? "Untitled",
        tags,
        content,
        awardId,
        certificationId,
        educationId,
        exhibitionId,
        featureId,
        projectId,
        sideProjectId,
        speakingId,
        volunteeringId,
        workExperienceId,
        writingId,
        profileUsername: params.profile
    });

    const redirectTo = by ? `/${params.profile}/edit/${by}` : undefined

    const safeRedirectTo = safeRedirect(redirectTo, `/${params.profile}/edit/posts`);

    return redirect(safeRedirectTo)
}

const NewPostPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <PostForm subaction="new" formId="newPostForm" />
    )
}

export default NewPostPage