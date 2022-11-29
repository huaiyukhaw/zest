import { json, redirect } from "@remix-run/node"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { setFormDefaults, ValidatedForm, validationError } from "remix-validated-form"
import { FormInput, SubmitButton, FormTextArea, YearSelect } from "~/components/form"
import FormHiddenInput from "~/components/form/FormHiddenInput"
import { deleteAward, getAwardOrThrow, publishAward, unpublishAward, updateAward } from "~/models/award.server"
import { CustomFormProps } from "~/types"

import { awardValidator as validator } from "~/validators/award"

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.awardId) throw new Error("Award id not found")

    const award = await getAwardOrThrow(params.awardId)

    return json(
        setFormDefaults("editAwardForm", award)
    );

}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    if (!params.awardId) throw new Error("Award id not found")

    const form = await request.formData()
    const subaction = form.get("subaction");

    switch (subaction) {
        case "delete":
            await deleteAward(params.awardId)
            break;

        case "publish":
            await publishAward(params.awardId)
            break;

        case "draft":
            await unpublishAward(params.awardId)
            break;

        case "edit":
            const result = await validator.validate(form);
            if (result.error) return validationError(result.error);

            await updateAward({
                id: params.awardId,
                ...result.data,
            })
            break;

        default:
            break;
    }
    return redirect(`/u/${params.profile}/edit/awards`)
}

export const AwardForm: React.FC<CustomFormProps> = ({
    subaction, formId
}) => {
    return (
        <>
            <div className="mx-1 mb-4 flex h-10 items-center">
                <h2 className="text-xl">
                    Awards
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
                        placeholder="My Great Award"
                    />
                    <YearSelect
                        name="year"
                        label="Year*"
                        numberOfYear={50}
                    />
                </div>
                <div className="flex gap-3">
                    <FormInput
                        name="presenter"
                        label="Presented by"
                        type="text"
                        placeholder="Apple"
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
                <Link to="../awards" className="btn-transparent">
                    Cancel
                </Link>
                <SubmitButton formId={formId}>Save</SubmitButton>
            </div>
        </>
    )
}

const AwardIdPage = () => {
    return (
        <AwardForm subaction="edit" formId="editAwardForm" />
    )
}

export default AwardIdPage