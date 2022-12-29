import { json, redirect } from "@remix-run/node"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Link, useBeforeUnload } from "@remix-run/react"
import { setFormDefaults, ValidatedForm, validationError } from "remix-validated-form"
import { FormInput, SubmitButton, FormTextArea, YearSelect } from "~/components/form"
import { FormHiddenInput } from "~/components/form"
import { deleteSpeaking, getSpeakingOrThrow, publishSpeaking, unpublishSpeaking, updateSpeaking } from "~/models/speaking.server"
import { CustomFormProps } from "~/types"
import { speakingValidator as validator } from "~/validators/speaking"
import { useCallback } from "react"

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
            const result = await validator.validate(form);
            if (result.error) return validationError(result.error);

            await updateSpeaking({
                id: params.speakingId,
                ...result.data,
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
            <div className="mb-4 flex h-10 items-center">
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
                className="overflow-y-auto scrollbar-hide flex flex-col flex-1 py-4"
            >
                <div className="flex flex-col sm:flex-row gap-x-3">
                    <FormInput
                        name="title"
                        label="Speaking title*"
                        type="text"
                        placeholder="My Great Talk"
                        autoFocus
                    />
                    <YearSelect
                        name="year"
                        label="Year*"
                        numberOfYear={50}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-x-3">
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
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <SpeakingForm
            subaction="edit"
            formId="editSpeakingForm"
        />
    )
}

export default SpeakingIdPage