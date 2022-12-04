import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createWriting } from "~/models/writing.server"
import { writingValidator as validator } from "~/validators/writing"
import { WritingForm } from "./$writingId"

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

    return redirect(`/u/${params.profile}/edit/writing`)
}

const NewWritingPage = () => {
    return (
        <WritingForm subaction="new" formId="newWritingForm" />
    )
}

export default NewWritingPage