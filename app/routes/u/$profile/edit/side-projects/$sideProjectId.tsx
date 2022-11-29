import { json, redirect } from "@remix-run/node"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { setFormDefaults, ValidatedForm, validationError } from "remix-validated-form"
import { FormInput, SubmitButton, FormTextArea, YearSelect } from "~/components/form"
import FormHiddenInput from "~/components/form/FormHiddenInput"
import { deleteSideProject, getSideProjectOrThrow, publishSideProject, unpublishSideProject, updateSideProject } from "~/models/side-project.server"
import { CustomFormProps } from "~/types"

import { sideProjectValidator as validator } from "~/validators/side-project"

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.sideProjectId) throw new Error("Side project id not found")

    const sideProject = await getSideProjectOrThrow(params.sideProjectId)

    return json(
        setFormDefaults("editProjectForm", sideProject)
    );
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    if (!params.sideProjectId) throw new Error("Side project id not found")

    const form = await request.formData()
    const subaction = form.get("subaction");

    switch (subaction) {
        case "delete":
            await deleteSideProject(params.sideProjectId)
            break;

        case "publish":
            await publishSideProject(params.sideProjectId)
            break;

        case "draft":
            await unpublishSideProject(params.sideProjectId)
            break;

        case "edit":
            const result = await validator.validate(form);
            if (result.error) return validationError(result.error);

            await updateSideProject({
                id: params.sideProjectId,
                ...result.data,
            })
            break;

        default:
            break;
    }
    return redirect(`/u/${params.profile}/edit/side-projects`)
}

export const SideProjectForm: React.FC<CustomFormProps> = ({ subaction, formId }) => {
    return (
        <>
            <div className="mx-1 mb-4 flex h-10 items-center">
                <h2 className="text-xl">
                    Projects
                </h2>
            </div>
            <ValidatedForm
                validator={validator}
                resetAfterSubmit
                method="post"
                subaction={subaction}
                id={formId}
                className="overflow-y-auto scrollbar-hide flex flex-col flex-1 m-1 py-4"
            >
                <div className="flex gap-3">
                    <FormInput
                        name="title"
                        label="Title*"
                        type="text"
                        placeholder="My Great Project"
                    />
                    <YearSelect
                        name="year"
                        label="Year*"
                        numberOfYear={50}
                        defaultIndex={1}
                        extraOption="Ongoing"
                    />
                </div>
                <div className="flex gap-3">
                    <FormInput
                        name="company"
                        label="Company or client"
                        type="text"
                        placeholder="Acme inc."
                    />
                    <FormInput
                        name="url"
                        label="Link to project"
                        type="text"
                        placeholder="https://example.com"

                    />
                </div>
                <div>
                    <FormTextArea
                        name="description"
                        label="Description"
                        placeholder="Add some details"
                    />
                </div>
                <FormHiddenInput name="published" value={subaction == "new" ? "true" : undefined} />
            </ValidatedForm>
            <div className="dialog-footer">
                <Link to="../side-projects" className="btn-transparent">
                    Cancel
                </Link>
                <SubmitButton formId={formId}>Save</SubmitButton>
            </div>
        </>
    )
}

const SideProjectIdPage = () => {
    return (
        <SideProjectForm subaction="edit" formId="editSideProjectForm" />
    )
}

export default SideProjectIdPage