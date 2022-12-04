import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createCertification } from "~/models/certification.server"
import { certificationValidator as validator } from "~/validators"
import { CertificationForm } from "./$certificationId"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { issued, expires, name, organization, url, description } = result.data

    await createCertification({
        issued, expires, name, organization, url, description,
        profileUsername: params.profile
    });

    return redirect(`/u/${params.profile}/edit/certifications`)
}

const NewCertificationPage = () => {
    return (
        <CertificationForm subaction="new" formId="newCertificationForm" />
    )
}

export default NewCertificationPage