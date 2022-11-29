import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createSpeaking } from "~/models/speaking.server"
import { speakingValidator as validator } from "~/validators/speaking"
import { SpeakingForm } from "./$speakingId"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);
    console.log("result", result)

    if (result.error) return validationError(result.error);

    const { title, year, event, location, url, description, published } = result.data

    await createSpeaking({
        title, year, event, location, url, description, published,
        profileUsername: params.profile
    });

    return redirect(`/u/${params.profile}/edit/speaking`)
}

const NewSpeakingPage = () => {
    return (
        <SpeakingForm
            subaction="new"
            formId="newSpeakingForm"
        />
    )
}

export default NewSpeakingPage