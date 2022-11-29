import { json, redirect } from "@remix-run/node"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { setFormDefaults, ValidatedForm, validationError } from "remix-validated-form"
import { FormInput, SubmitButton, FormTextArea, YearSelect } from "~/components/form"
import FormHiddenInput from "~/components/form/FormHiddenInput"
import { deleteFeature, getFeatureOrThrow, publishFeature, unpublishFeature, updateFeature } from "~/models/feature.server"
import { CustomFormProps } from "~/types"

import { featureValidator as validator } from "~/validators/feature"

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.featureId) throw new Error("Feature id not found")

    const feature = await getFeatureOrThrow(params.featureId)

    return json(
        setFormDefaults("editFeatureForm", feature)
    );
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    if (!params.featureId) throw new Error("Feature id not found")

    const form = await request.formData()
    const subaction = form.get("subaction");

    switch (subaction) {
        case "delete":
            await deleteFeature(params.featureId)
            break;

        case "publish":
            await publishFeature(params.featureId)
            break;

        case "draft":
            await unpublishFeature(params.featureId)
            break;

        case "edit":
            const result = await validator.validate(form);
            if (result.error) return validationError(result.error);

            await updateFeature({
                id: params.featureId,
                ...result.data,
            })
            break;

        default:
            break;
    }
    return redirect(`/u/${params.profile}/edit/features`)
}

export const FeatureForm: React.FC<CustomFormProps> = ({
    subaction, formId
}) => {
    return (
        <>
            <div className="mx-1 mb-4 flex h-10 items-center">
                <h2 className="text-xl">
                    Features
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
                        placeholder="My Great Feature"
                    />
                    <YearSelect
                        name="year"
                        label="Year*"
                        numberOfYear={50}
                    />
                </div>
                <div className="flex gap-3">
                    <FormInput
                        name="publisher"
                        label="Publisher"
                        type="text"
                        placeholder="The Verge"
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
                <Link to="../features" className="btn-transparent">
                    Cancel
                </Link>
                <SubmitButton formId={formId}>Save</SubmitButton>
            </div>
        </>
    )
}

const FeatureIdPage = () => {
    return (
        <FeatureForm subaction="edit" formId="editFeatureForm" />
    )
}

export default FeatureIdPage