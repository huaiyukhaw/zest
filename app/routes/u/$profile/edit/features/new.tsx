import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createFeature } from "~/models/feature.server"
import { featureValidator as validator } from "~/validators/feature"
import { FeatureForm } from "./$featureId"
import { useBeforeUnload } from "@remix-run/react"
import { useCallback } from "react"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { title, year, publisher, url, description } = result.data

    await createFeature({
        title, year, publisher, url, description,
        profileUsername: params.profile
    });

    return redirect(`/u/${params.profile}/edit/features`)
}

const NewFeaturePage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <FeatureForm subaction="new" formId="newFeatureForm" />
    )
}

export default NewFeaturePage