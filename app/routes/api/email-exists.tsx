/**
 * Endpoint used for email asyncValidation
 */
import { z } from "zod";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { isEmailAvailable } from "~/models/user.server";

const validator = withZod(
    z.object({
        email: z.string(),
    })
);

export const loader: LoaderFunction = async ({
    request
}) => {
    const params = new URL(request.url).searchParams
    const result = await validator.validate(params)
    if (result.error) return {
        emailTaken: false
    };

    const { email } = result.data
    const emailAvailable = await isEmailAvailable(email)

    return json({
        emailTaken: !emailAvailable
    })
};