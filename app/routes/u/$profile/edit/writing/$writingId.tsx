import { json, redirect } from "@remix-run/node"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { setFormDefaults, ValidatedForm, validationError } from "remix-validated-form"
import { FormInput, SubmitButton, FormTextArea, YearSelect } from "~/components/form"
import FormHiddenInput from "~/components/form/FormHiddenInput"
import { deleteWriting, getWritingOrThrow, publishWriting, unpublishWriting, updateWriting } from "~/models/writing.server"
import { CustomFormProps } from "~/types"

import { writingValidator as validator } from "~/validators/writing"

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.writingId) throw new Error("Writing id not found")

    const writing = await getWritingOrThrow(params.writingId)

    return json(
        setFormDefaults("editWritingForm", writing)
    );
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    if (!params.writingId) throw new Error("Writing id not found")

    const form = await request.formData()
    const subaction = form.get("subaction");

    switch (subaction) {
        case "delete":
            await deleteWriting(params.writingId)
            break;

        case "publish":
            await publishWriting(params.writingId)
            break;

        case "draft":
            await unpublishWriting(params.writingId)
            break;

        case "edit":
            const result = await validator.validate(form);
            if (result.error) return validationError(result.error);

            await updateWriting({
                id: params.writingId,
                ...result.data,
            })
            break;

        default:
            break;
    }
    return redirect(`/u/${params.profile}/edit/writing`)
}

export const WritingForm: React.FC<CustomFormProps> = ({
    subaction, formId
}) => {
    return (
        <>
            <div className="mx-1 mb-4 flex h-10 items-center">
                <h2 className="text-xl">
                    Writing
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
                        placeholder="My Great Piece"
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
                        placeholder="Jacobin Magazine"
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
                <Link to="../writing" className="btn-transparent">
                    Cancel
                </Link>
                <SubmitButton formId={formId}>Save</SubmitButton>
            </div>
        </>
    )
}

const WritingIdPage = () => {
    return (
        <WritingForm subaction="edit" formId="editWritingForm" />
    )
}

export default WritingIdPage