import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { setFormDefaults, ValidatedForm, validationError } from "remix-validated-form"
import { FormInput, SubmitButton, FormTextArea, YearSelect } from "~/components/form"
import FormHiddenInput from "~/components/form/FormHiddenInput"
import { deleteSpeaking, getSpeakingOrThrow, publishSpeaking, unpublishSpeaking, updateSpeaking } from "~/models/speaking.server"
import { CustomFormProps } from "~/types"

import { speakingValidator as validator } from "~/validators/speaking"

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.speakingId) throw new Error("Speaking id not found")

    const speaking = await getSpeakingOrThrow(params.speakingId)

    return json(
        setFormDefaults("editSpeakingForm", speaking)
    );
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    if (!params.speakingId) throw new Error("Speaking id not found")

    const form = await request.formData()
    const subaction = form.get("subaction");
    console.log(subaction)

    switch (subaction) {
        case "delete":
            await deleteSpeaking(params.speakingId)
            break;

        case "publish":
            await publishSpeaking(params.speakingId)
            break;

        case "draft":
            await unpublishSpeaking(params.speakingId)
            break;

        case "edit":
            const editResult = await validator.validate(form);
            if (editResult.error) return validationError(editResult.error);

            await updateSpeaking({
                id: params.speakingId,
                ...editResult.data,
            })
            break;

        default:
            break;
    }
    return redirect(`/u/${params.profile}/edit/speaking`)
}

export const SpeakingForm: React.FC<CustomFormProps> = ({
    subaction, formId
}) => {
    return (
        <>
            <div className="mx-1 mb-4 flex h-10 items-center">
                <h2 className="text-xl">
                    Speaking
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
                        label="Speaking title*"
                        type="text"
                        placeholder="My Great Talk"
                    />
                    <YearSelect
                        name="year"
                        label="Year*"
                        numberOfYear={50}
                    />
                </div>
                <div className="flex gap-3">
                    <FormInput
                        name="event"
                        label="Event"
                        type="text"
                        placeholder="SXSW"
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
                <Link to="../speaking" className="btn-transparent">
                    Cancel
                </Link>
                <SubmitButton formId={formId}>Save</SubmitButton>
            </div>
        </>
    )
}

const SpeakingIdPage = () => {
    return (
        <SpeakingForm
            subaction="edit"
            formId="editSpeakingForm"
        />
    )
}

export default SpeakingIdPage