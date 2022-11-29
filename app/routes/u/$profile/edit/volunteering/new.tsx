import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createVolunteering } from "~/models/volunteering.server"
import { volunteeringValidator as validator } from "~/validators"
import { VolunteeringForm } from "./$volunteeringId"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { from, to, title, organization, location, url, description, published } = result.data

    await createVolunteering({
        from, to, title, organization, location, url, description, published,
        profileUsername: params.profile
    });

    return redirect(`/u/${params.profile}/edit/volunteering`)
}

const NewVolunteeringPage = () => {
    return (
        <VolunteeringForm subaction="new" formId="newVolunteeringForm" />
    )
}

export default NewVolunteeringPage