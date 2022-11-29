import { json, redirect } from "@remix-run/node"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { setFormDefaults, ValidatedForm, validationError } from "remix-validated-form"
import { FormInput, SubmitButton, FormTextArea, YearSelect } from "~/components/form"
import FormHiddenInput from "~/components/form/FormHiddenInput"
import { deleteVolunteering, getVolunteeringOrThrow, publishVolunteering, unpublishVolunteering, updateVolunteering } from "~/models/volunteering.server"
import { CustomFormProps } from "~/types"

import { volunteeringValidator as validator } from "~/validators/volunteering"

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.volunteeringId) throw new Error("Volunteering id not found")

    const volunteering = await getVolunteeringOrThrow(params.volunteeringId)

    return json(
        setFormDefaults("editVolunteeringForm", volunteering)
    );
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    if (!params.volunteeringId) throw new Error("Volunteering id not found")

    const form = await request.formData()
    const subaction = form.get("subaction");

    switch (subaction) {
        case "delete":
            await deleteVolunteering(params.volunteeringId)
            break;

        case "publish":
            await publishVolunteering(params.volunteeringId)
            break;

        case "draft":
            await unpublishVolunteering(params.volunteeringId)
            break;

        case "edit":
            const result = await validator.validate(form);
            if (result.error) return validationError(result.error);

            await updateVolunteering({
                id: params.volunteeringId,
                ...result.data,
            })
            break;

        default:
            break;
    }
    return redirect(`/u/${params.profile}/edit/volunteering`)
}

export const VolunteeringForm: React.FC<CustomFormProps> = ({ subaction, formId }) => {
    return (
        <>
            <div className="mx-1 mb-4 flex h-10 items-center">
                <h2 className="text-xl">
                    Volunteering
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
                <div className="flex gap-3">
                    <FormInput
                        name="title"
                        label="Title*"
                        type="text"
                        placeholder="Volunteer, coordinator, etc"

                    />
                    <FormInput
                        name="organization"
                        label="Organization*"
                        type="text"
                        placeholder="Non-profit org."
                    />
                </div>
                <div className="flex gap-3">
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
            <div className="dialog-footer">
                <Link to="../volunteering" className="btn-transparent">
                    Cancel
                </Link>
                <SubmitButton formId={formId}>Save</SubmitButton>
            </div>
        </>
    )
}

const VolunteeringIdPage = () => {
    return (
        <VolunteeringForm subaction="edit" formId="editVolunteeringForm" />
    )
}

export default VolunteeringIdPage