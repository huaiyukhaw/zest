import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createSideProject } from "~/models/side-project.server"
import { sideProjectValidator as validator } from "~/validators"
import { SideProjectForm } from "./$sideProjectId"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { title, year, company, url, description } = result.data

    await createSideProject({
        title, year, company, url, description,
        profileUsername: params.profile
    });

    return redirect(`/u/${params.profile}/edit/side-projects`)
}

const NewSideProjectPage = () => {
    return (
        <SideProjectForm subaction="new" formId="newSideProjectForm" />
    )
}

export default NewSideProjectPage