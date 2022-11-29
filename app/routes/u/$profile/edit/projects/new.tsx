import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createProject } from "~/models/project.server"
import { projectValidator as validator } from "~/validators/project"
import { ProjectForm } from "./$projectId"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { title, year, company, url, description, published } = result.data

    await createProject({
        title, year, company, url, description, published,
        profileUsername: params.profile
    });

    return redirect(`/u/${params.profile}/edit/projects`)
}

const NewProjectPage = () => {
    return (
        <ProjectForm subaction="new" formId="newProjectForm" />
    )
}

export default NewProjectPage