import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createVolunteering } from "~/models/volunteering.server"
import { volunteeringValidator as validator } from "~/validators"
import { VolunteeringForm } from "./$volunteeringId"
import { useBeforeUnload } from "@remix-run/react"
import { useCallback } from "react"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { from, to, title, organization, location, url, description } = result.data

    await createVolunteering({
        from, to, title, organization, location, url, description,
        profileUsername: params.profile
    });

    return redirect(`/${params.profile}/edit/volunteering`)
}

const NewVolunteeringPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <VolunteeringForm subaction="new" formId="newVolunteeringForm" />
    )
}

export default NewVolunteeringPage