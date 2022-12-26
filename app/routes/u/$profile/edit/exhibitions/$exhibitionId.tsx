import { json, redirect } from "@remix-run/node"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Link, useBeforeUnload } from "@remix-run/react"
import { setFormDefaults, ValidatedForm, validationError } from "remix-validated-form"
import { FormInput, SubmitButton, FormTextArea, YearSelect } from "~/components/form"
import { FormHiddenInput } from "~/components/form"
import { deleteExhibition, getExhibitionOrThrow, publishExhibition, unpublishExhibition, updateExhibition } from "~/models/exhibition.server"
import { CustomFormProps } from "~/types"
import { exhibitionValidator as validator } from "~/validators/exhibition"
import { useCallback } from "react"

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.exhibitionId) throw new Error("Exhibition id not found")

    const exhibition = await getExhibitionOrThrow(params.exhibitionId)

    return json(
        setFormDefaults("editExhibitionForm", exhibition)
    );
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    if (!params.exhibitionId) throw new Error("Exhibition id not found")

    const form = await request.formData()
    const subaction = form.get("subaction");

    switch (subaction) {
        case "delete":
            await deleteExhibition(params.exhibitionId)
            break;

        case "publish":
            await publishExhibition(params.exhibitionId)
            break;

        case "draft":
            await unpublishExhibition(params.exhibitionId)
            break;

        case "edit":
            const result = await validator.validate(form);
            if (result.error) return validationError(result.error);

            await updateExhibition({
                id: params.exhibitionId,
                ...result.data,
            })
            break;

        default:
            break;
    }
    return redirect(`/u/${params.profile}/edit/exhibitions`)
}

export const ExhibitionForm: React.FC<CustomFormProps> = ({
    subaction, formId
}) => {
    return (
        <>
            <div className="mb-4 flex h-10 items-center">
                <h2 className="text-xl">
                    Exhibitions
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
                <div className="flex gap-3">
                    <FormInput
                        name="title"
                        label="Exhibition title*"
                        type="text"
                        placeholder="My Great Exhibition"
                        autoFocus
                    />
                    <YearSelect
                        name="year"
                        label="Year*"
                        numberOfYear={50}
                    />
                </div>
                <div className="flex gap-3">
                    <FormInput
                        name="venue"
                        label="Venue"
                        type="text"
                        placeholder="The Vancouver Art Gallery"
                    />
                    <FormInput
                        name="location"
                        label="Location"
                        type="text"
                        placeholder="City or country"
                    />
                </div>
                <div>
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
                <Link to="../exhibitions" className="btn-transparent">
                    Cancel
                </Link>
                <SubmitButton formId={formId}>Save</SubmitButton>
            </div>
        </>
    )
}

const ExhibitionIdPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <ExhibitionForm
            subaction="edit"
            formId="editExhibitionForm"
        />
    )
}

export default ExhibitionIdPage