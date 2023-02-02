import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createLink } from "~/models/link.server"
import { linkValidator as validator } from "~/validators"
import { LinkForm } from "./$linkId"
import { useBeforeUnload } from "@remix-run/react"
import { useCallback } from "react"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { name, username, url } = result.data

    await createLink({
        name, username, url,
        profileUsername: params.profile
    });

    return redirect(`/${params.profile}/edit/links`)
}

const NewLinkPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <LinkForm subaction="new" formId="newLinkForm" />
    )
}

export default NewLinkPage