import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createEducation } from "~/models/education.server"
import { educationValidator as validator } from "~/validators"
import { EducationForm } from "./$educationId"
import { useBeforeUnload } from "@remix-run/react"
import { useCallback } from "react"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { from, to, degree, school, location, url, description } = result.data

    await createEducation({
        from, to, degree, school, location, url, description,
        profileUsername: params.profile
    });

    return redirect(`/${params.profile}/edit/education`)
}

const NewEducationPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <EducationForm subaction="new" formId="newEducationForm" />
    )
}

export default NewEducationPage