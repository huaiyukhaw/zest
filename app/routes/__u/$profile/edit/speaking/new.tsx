import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createSpeaking } from "~/models/speaking.server"
import { speakingValidator as validator } from "~/validators/speaking"
import { SpeakingForm } from "./$speakingId"
import { useBeforeUnload } from "@remix-run/react"
import { useCallback } from "react"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { title, year, event, location, url, description } = result.data

    await createSpeaking({
        title, year, event, location, url, description,
        profileUsername: params.profile
    });

    return redirect(`/${params.profile}/edit/speaking`)
}

const NewSpeakingPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <SpeakingForm
            subaction="new"
            formId="newSpeakingForm"
        />
    )
}

export default NewSpeakingPage