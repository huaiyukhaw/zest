import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createProject } from "~/models/project.server"
import { projectValidator as validator } from "~/validators/project"
import { ProjectForm } from "./$projectId"
import { useBeforeUnload } from "@remix-run/react"
import { useCallback } from "react"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { title, year, company, url, description } = result.data

    await createProject({
        title, year, company, url, description,
        profileUsername: params.profile
    });

    return redirect(`/${params.profile}/edit/projects`)
}

const NewProjectPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <ProjectForm subaction="new" formId="newProjectForm" />
    )
}

export default NewProjectPage