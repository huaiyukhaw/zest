import { json, redirect } from "@remix-run/node"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { setFormDefaults, ValidatedForm, validationError } from "remix-validated-form"
import { FormInput, SubmitButton, FormTextArea, YearSelect } from "~/components/form"
import FormHiddenInput from "~/components/form/FormHiddenInput"
import { deleteLink, getLinkOrThrow, publishLink, unpublishLink, updateLink } from "~/models/link.server"
import { CustomFormProps } from "~/types"

import { linkValidator as validator } from "~/validators/link"

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.linkId) throw new Error("Link id not found")

    const link = await getLinkOrThrow(params.linkId)

    return json(
        setFormDefaults("editLinkForm", link)
    );
}

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    if (!params.linkId) throw new Error("Link id not found")

    const form = await request.formData()
    const subaction = form.get("subaction");

    switch (subaction) {
        case "delete":
            await deleteLink(params.linkId)
            break;

        case "publish":
            await publishLink(params.linkId)
            break;

        case "draft":
            await unpublishLink(params.linkId)
            break;

        case "edit":
            const result = await validator.validate(form);
            if (result.error) return validationError(result.error);

            await updateLink({
                id: params.linkId,
                ...result.data,
            })
            break;

        default:
            break;
    }
    return redirect(`/u/${params.profile}/edit/links`)
}

export const LinkForm: React.FC<CustomFormProps> = ({
    subaction, formId
}) => {
    return (
        <>
            <div className="mx-1 mb-4 flex h-10 items-center">
                <h2 className="text-xl">
                    Social Links
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
                        name="name"
                        label="Name of platform*"
                        type="text"
                        placeholder="LinkedIn, Twitter, Medium etc."
                    />
                    <FormInput
                        name="username"
                        label="Username"
                        type="text"
                        placeholder="Username"
                    />
                </div>
                <div>
                    <FormInput
                        name="url"
                        label="URL*"
                        type="text"
                        placeholder="https://example.com"
                    />
                </div>
                <FormHiddenInput name="published" value={subaction == "new" ? "true" : undefined} />
            </ValidatedForm>
            <div className="dialog-footer">
                <Link to="../links" className="btn-transparent">
                    Cancel
                </Link>
                <SubmitButton formId={formId}>Save</SubmitButton>
            </div>
        </>
    )
}

const LinkIdPage = () => {
    return (
        <LinkForm subaction="edit" formId="editLinkForm" />
    )
}

export default LinkIdPage