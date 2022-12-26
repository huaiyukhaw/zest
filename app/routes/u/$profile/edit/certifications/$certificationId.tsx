import { useCallback } from "react"
import { json, redirect } from "@remix-run/node"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Link, useBeforeUnload } from "@remix-run/react"
import { setFormDefaults, ValidatedForm, validationError } from "remix-validated-form"
import { FormInput, SubmitButton, FormTextArea, YearSelect } from "~/components/form"
import { FormHiddenInput } from "~/components/form"
import { deleteCertification, getCertificationOrThrow, publishCertification, unpublishCertification, updateCertification } from "~/models/certification.server"
import type { CustomFormProps } from "~/types"
import { certificationValidator as validator } from "~/validators/certification"

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.certificationId) throw new Error("Certification id not found")

    const certification = await getCertificationOrThrow(params.certificationId)

    return json(
        setFormDefaults("editCertificationForm", certification)
    );
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    if (!params.certificationId) throw new Error("Certification id not found")

    const form = await request.formData()
    const subaction = form.get("subaction");

    switch (subaction) {
        case "delete":
            await deleteCertification(params.certificationId)
            break;

        case "publish":
            await publishCertification(params.certificationId)
            break;

        case "draft":
            await unpublishCertification(params.certificationId)
            break;

        case "edit":
            const result = await validator.validate(form);
            if (result.error) return validationError(result.error);

            await updateCertification({
                id: params.certificationId,
                ...result.data,
            })
            break;

        default:
            break;
    }
    return redirect(`/u/${params.profile}/edit/certifications`)
}

export const CertificationForm: React.FC<CustomFormProps> = ({ subaction, formId }) => {
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
                    Certifications
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
                    <YearSelect
                        name="issued"
                        label="Issued*"
                        numberOfYear={50}
                        defaultIndex={2}
                    />
                    <YearSelect
                        name="expires"
                        label="Expires*"
                        numberOfYear={50}
                        afterOrEqualTo="from"
                        extraOption="Does not expire"
                    />
                </div>
                <div className="flex gap-3">
                    <FormInput
                        name="name"
                        label="Name*"
                        type="text"
                        placeholder="My certification"
                        autoFocus
                    />
                    <FormInput
                        name="organization"
                        label="Organization*"
                        type="text"
                        placeholder="Issuing organization"
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
                        placeholder="Add some details, e.g. ID number"
                    />
                </div>
                <FormHiddenInput name="published" value={subaction == "new" ? "true" : undefined} />
            </ValidatedForm>
            <div className="dialog-footer">
                <Link to="../certifications" className="btn-transparent">
                    Cancel
                </Link>
                <SubmitButton formId={formId}>Save</SubmitButton>
            </div>
        </>
    )
}

const CertificationIdPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <CertificationForm subaction="edit" formId="editCertificationForm" />
    )
}

export default CertificationIdPage