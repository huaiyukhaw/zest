import type { LoaderArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { requireUserId } from "~/session.server";

export async function loader({ request }: LoaderArgs) {
    const userId = await requireUserId(request);
    if (!userId) {
        return redirect("/login")
    }
    return json({})
}

const UserPage = () => {
    return <Outlet />
}

export default UserPage