import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createSideProject } from "~/models/side-project.server"
import { sideProjectValidator as validator } from "~/validators"
import { SideProjectForm } from "./$sideProjectId"
import { useBeforeUnload } from "@remix-run/react"
import { useCallback } from "react"

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

    return redirect(`/${params.profile}/edit/side-projects`)
}

const NewSideProjectPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <SideProjectForm subaction="new" formId="newSideProjectForm" />
    )
}

export default NewSideProjectPage