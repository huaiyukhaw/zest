/**
 * Endpoint used for username asyncValidation
 */
import { z } from "zod";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { isUsernameAvailable } from "~/models/profile.server";
import { withZod } from "@remix-validated-form/with-zod";

const validator = withZod(
    z.object({
        username: z.string(),
    })
);

export const loader: LoaderFunction = async ({
    request
}) => {
    const params = new URL(request.url).searchParams
    const result = await validator.validate(params)
    if (result.error) return {
        usernameTaken: false
    };

    const { username } = result.data
    const usernameAvailable = await isUsernameAvailable(username)

    return json({
        usernameTaken: !usernameAvailable
    })
};