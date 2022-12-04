import { redirect } from "@remix-run/node"
import type { ActionFunction } from "@remix-run/node"
import { validationError } from "remix-validated-form"
import { createExhibition } from "~/models/exhibition.server"
import { exhibitionValidator as validator } from "~/validators/exhibition"
import { ExhibitionForm } from "./$exhibitionId"

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const result = await validator.validate(form);

    if (result.error) return validationError(result.error);

    const { title, year, venue, location, url, description } = result.data

    await createExhibition({
        title, year, venue, location, url, description,
        profileUsername: params.profile
    });

    return redirect(`/u/${params.profile}/edit/exhibitions`)
}

const NewExhibitionPage = () => {
    return (
        <ExhibitionForm
            subaction="new"
            formId="newExhibitionForm"
        />
    )
}

export default NewExhibitionPage