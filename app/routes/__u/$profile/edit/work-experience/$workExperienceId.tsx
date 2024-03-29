import { json, redirect } from "@remix-run/node"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Link, useBeforeUnload } from "@remix-run/react"
import { setFormDefaults, ValidatedForm, validationError } from "remix-validated-form"
import { FormInput, SubmitButton, FormTextArea, YearSelect } from "~/components/form"
import { FormHiddenInput } from "~/components/form"
import { deleteWorkExperience, getWorkExperienceOrThrow, publishWorkExperience, unpublishWorkExperience, updateWorkExperience } from "~/models/work-experience.server"
import { CustomFormProps } from "~/types"

import { workExperienceValidator as validator } from "~/validators/work-experience"
import { useCallback } from "react"

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.workExperienceId) throw new Error("Work experience id not found")

    const workExperience = await getWorkExperienceOrThrow(params.workExperienceId)

    return json(
        setFormDefaults("editWorkExperienceForm", workExperience)
    );
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    if (!params.workExperienceId) throw new Error("Work experience id not found")

    const form = await request.formData()
    const subaction = form.get("subaction");

    switch (subaction) {
        case "delete":
            await deleteWorkExperience(params.workExperienceId)
            break;

        case "publish":
            await publishWorkExperience(params.workExperienceId)
            break;

        case "draft":
            await unpublishWorkExperience(params.workExperienceId)
            break;

        case "edit":
            const result = await validator.validate(form);
            if (result.error) return validationError(result.error);

            await updateWorkExperience({
                id: params.workExperienceId,
                ...result.data,
            })
            break;

        default:
            break;
    }
    return redirect(`/${params.profile}/edit/work-experience`)
}

export const WorkExperienceForm: React.FC<CustomFormProps> = ({ subaction, formId }) => {
    return (
        <>
            <div className="mb-4 flex h-10 items-center">
                <h2 className="text-xl">
                    Work Experience
                </h2>
            </div>
            <ValidatedForm
                validator={validator}
                resetAfterSubmit
                method="post"
                subaction={subaction}
                id={formId}
                className="overflow-y-auto scrollbar-hide flex flex-col flex-1 py-4"
            >
                <div className="flex flex-col sm:flex-row gap-x-3">
                    <YearSelect
                        name="from"
                        label="From*"
                        numberOfYear={50}
                        defaultIndex={2}
                    />
                    <YearSelect
                        name="to"
                        label="To*"
                        numberOfYear={50}
                        afterOrEqualTo="from"
                        extraOption="Now"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-x-3">
                    <FormInput
                        name="title"
                        label="Title*"
                        type="text"
                        placeholder="Software engineer, data scientist, etc"
                        autoFocus
                    />
                    <FormInput
                        name="company"
                        label="Company*"
                        type="text"
                        placeholder="Acme inc."
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-x-3">
                    <FormInput
                        name="location"
                        label="Location"
                        type="text"
                        placeholder="Where was it"
                    />
                    <FormInput
                        name="url"
                        label="URL"
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
            <div className="flex h-16 items-center justify-end gap-1.5">
                <Link to="../work-experience" className="btn-transparent">
                    Cancel
                </Link>
                <SubmitButton formId={formId}>Save</SubmitButton>
            </div>
        </>
    )
}

const WorkExperienceIdPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <WorkExperienceForm subaction="edit" formId="editWorkExperienceForm" />
    )
}

export default WorkExperienceIdPage