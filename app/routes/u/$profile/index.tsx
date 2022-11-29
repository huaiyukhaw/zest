import { json } from "@remix-run/node"
import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { getProfileByUsername } from "~/models/profile.server";
import { getUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ params, request }) => {
    if (!params.profile) {
        throw new Response("Profile username is missing", {
            status: 400,
        });
    }

    const userId = await getUserId(request);
    const profile = await getProfileByUsername(params.profile)

    if (!profile) {
        const data = {
            profileUsername: params.profile
        }
        throw json(data, { status: 404 })
    }

    if (userId && profile.userId === userId) {
        throw redirect(`/u/${params.profile}/edit`)
    }

    return json({});
}

const UserIndexPage = () => {
    return (
        <div></div>
    )
}

export default UserIndexPage