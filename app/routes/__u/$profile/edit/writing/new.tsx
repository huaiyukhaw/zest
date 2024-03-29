import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createWriting } from "~/models/writing.server"
import { writingValidator as validator } from "~/validators/writing"
import { WritingForm } from "./$writingId"
import { useBeforeUnload } from "@remix-run/react"
import { useCallback } from "react"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { title, year, publisher, url, description } = result.data

    await createWriting({
        title, year, publisher, url, description,
        profileUsername: params.profile
    });

    return redirect(`/${params.profile}/edit/writing`)
}

const NewWritingPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <WritingForm subaction="new" formId="newWritingForm" />
    )
}

export default NewWritingPage