import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createAward } from "~/models/award.server"
import { awardValidator as validator } from "~/validators/award"
import { AwardForm } from "./$awardId"
import { useBeforeUnload } from "@remix-run/react"
import { useCallback } from "react"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { title, year, presenter, url, description } = result.data

    await createAward({
        title, year, presenter, url, description,
        profileUsername: params.profile
    });

    return redirect(`/${params.profile}/edit/awards`)
}

const NewAwardPage = () => {
    useBeforeUnload(
        useCallback((event) => {
            event.preventDefault()
            return event.returnValue = "You have unsaved changes, leave anyway?";
        }, [])
    );

    return (
        <AwardForm subaction="new" formId="newAwardForm" />
    )
}

export default NewAwardPage