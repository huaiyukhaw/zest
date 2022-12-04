import { useState } from "react"
import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node"
import { AlertDialog } from "~/components/radix";
import { requireUserId } from "~/session.server";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getProfileByUsernameOrThrow, updateSectionOrder } from "~/models/profile.server";
import type { EditProfileCatchData } from "../$profile";
import { Routes } from "~/components/navigation";
import { defaultRoutes, RouteType } from "~/utils";

export type SectionOrderData = {
    sectionOrder: Array<RouteType> | null
}

export const loader: LoaderFunction = async ({
    request, params
}) => {
    if (!params.profile) throw new Error("Profile username not found")

    const userId = await requireUserId(request);
    const { userId: profileOwnerId, userEmail: profileOwnerEmail, sectionOrder } = await getProfileByUsernameOrThrow(params.profile)

    if (!profileOwnerId.includes(userId)) {
        const data: EditProfileCatchData = { profileOwnerEmail }
        throw json(data, { status: 401 })
    }

    if (!sectionOrder) {
        return json({ sectionOrder: null })
    }

    return json({
        sectionOrder: sectionOrder.split(",").map((id) => {
            const index = defaultRoutes.findIndex((route) => route.id === id)
            return defaultRoutes[index]
        })
    })
};

export const action: ActionFunction = async ({ request, params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const form = await request.formData()
    const sectionOrder = form.get("sectionOrder")

    if (sectionOrder) {
        const profile = await getProfileByUsernameOrThrow(params.profile)

        await updateSectionOrder({
            id: profile.id, sectionOrder: sectionOrder.toString()
        })
    }

    return json({
        sectionOrder: null
    })
}

const ProfileEditPage = () => {
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false)
    const { sectionOrder } = useLoaderData<SectionOrderData>()

    return (
        <AlertDialog.Root open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen} >
            <AlertDialog.Trigger
                className="fixed h-fit bottom-6 left-6 text-sm px-4 py-3 bg-white hover:bg-gray-100 border border-gray-300 dark:border-transparent dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600 dark:text-white disabled:opacity-50 flex items-center gap-1 rounded-full"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                    className="w-3 h-3"
                >
                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                </svg>
                <span className="font-medium text-sm">
                    Edit profile
                </span>
            </AlertDialog.Trigger>
            <AlertDialog.Transition show={isAlertDialogOpen}>
                <AlertDialog.Content lg noPadding>
                    <div className="flex divide-x divide-gray-200 dark:divide-gray-700 h-[95vh] sm:h-[75vh]">
                        <div className="flex-none max-w-[200px] w-full py-6">
                            <h3 className="pl-9 pr-6 text-xs py-1.5 text-gray-500 dark:text-gray-400">
                                Profile
                            </h3>
                            <Routes sectionOrder={sectionOrder} />
                        </div>
                        <div className="
                            flex flex-col min-w-0 flex-1 px-8 pt-8
                            divide-y divide-gray-200 dark:divide-gray-700
                        ">
                            <Outlet />
                        </div>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Transition>
        </AlertDialog.Root>
    )
}

export default ProfileEditPage