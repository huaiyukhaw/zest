import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createWorkExperience } from "~/models/work-experience.server"
import { workExperienceValidator as validator } from "~/validators"
import { WorkExperienceForm } from "./$workExperienceId"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { from, to, title, company, location, url, description, published } = result.data

    await createWorkExperience({
        from, to, title, company, location, url, description, published,
        profileUsername: params.profile
    });

    return redirect(`/u/${params.profile}/edit/work-experience`)
}

const NewWorkExperiencePage = () => {
    return (
        <WorkExperienceForm subaction="new" formId="newWorkExperienceForm" />
    )
}

export default NewWorkExperiencePage