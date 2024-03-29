import { useCallback } from "react"
import { json, redirect } from "@remix-run/node"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Link, useBeforeUnload } from "@remix-run/react"
import { setFormDefaults, ValidatedForm, validationError } from "remix-validated-form"
import { FormInput, SubmitButton, FormTextArea, YearSelect } from "~/components/form"
import { FormHiddenInput } from "~/components/form"
import { deleteEducation, getEducationOrThrow, publishEducation, unpublishEducation, updateEducation } from "~/models/education.server"
import type { CustomFormProps } from "~/types"
import { educationValidator as validator } from "~/validators/education"

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.educationId) throw new Error("Education id not found")

    const education = await getEducationOrThrow(params.educationId)

    return json(
        setFormDefaults("editEducationForm", education)
    );
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    if (!params.educationId) throw new Error("Education id not found")

    const form = await request.formData()
    const subaction = form.get("subaction");

    switch (subaction) {
        case "delete":
            await deleteEducation(params.educationId)
            break;

        case "publish":
            await publishEducation(params.educationId)
            break;

        case "draft":
            await unpublishEducation(params.educationId)
            break;

        case "edit":
            const result = await validator.validate(form);
            if (result.error) return validationError(result.error);

            await updateEducation({
                id: params.educationId,
                ...result.data,
            })
            break;

        default:
            break;
    }
    return redirect(`/${params.profile}/edit/education`)
}

export const EducationForm: React.FC<CustomFormProps> = ({ subaction, formId }) => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <>
            <div className="mb-4 flex h-10 items-center">
                <h2 className="text-xl">
                    Education
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
                        name="degree"
                        label="Degree or certification*"
                        type="text"
                        placeholder="Bachelor of Computer Science"
                        autoFocus
                    />
                    <FormInput
                        name="school"
                        label="School or institution*"
                        type="text"
                        placeholder="Emily Carr University"
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
                <Link to="../education" className="btn-transparent">
                    Cancel
                </Link>
                <SubmitButton formId={formId}>Save</SubmitButton>
            </div>
        </>
    )
}

const EducationIdPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <EducationForm subaction="edit" formId="editEducationForm" />
    )
}

export default EducationIdPage