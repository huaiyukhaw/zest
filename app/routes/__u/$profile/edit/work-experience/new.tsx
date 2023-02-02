import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createWorkExperience } from "~/models/work-experience.server"
import { workExperienceValidator as validator } from "~/validators"
import { WorkExperienceForm } from "./$workExperienceId"
import { useBeforeUnload } from "@remix-run/react"
import { useCallback } from "react"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { from, to, title, company, location, url, description } = result.data

    await createWorkExperience({
        from, to, title, company, location, url, description,
        profileUsername: params.profile
    });

    return redirect(`/${params.profile}/edit/work-experience`)
}

const NewWorkExperiencePage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <WorkExperienceForm subaction="new" formId="newWorkExperienceForm" />
    )
}

export default NewWorkExperiencePage