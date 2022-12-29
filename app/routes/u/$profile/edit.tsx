import { useState } from "react"
import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node"
import { useOutletContext } from "@remix-run/react"
import { AlertDialog } from "~/components/radix";
import { requireUserId } from "~/session.server";
import { Form, Outlet, useLoaderData, useSearchParams } from "@remix-run/react";
import { getProfileByUsername, updateSectionOrder } from "~/models/profile.server";
import type { EditProfileCatchData } from "~/routes/u/$profile";
import { Routes } from "~/components/navigation";
import { defaultRoutes } from "~/utils";
import type { RouteType } from "~/utils";
import clsx from "clsx";

export type SectionOrderData = {
    sectionOrder: Array<RouteType> | null
}

export const loader: LoaderFunction = async ({
    request, params
}) => {
    if (!params.profile) throw new Error("Profile username not found")

    const userId = await requireUserId(request);
    const profile = await getProfileByUsername(params.profile, true);

    if (!profile) {
        const data = {
            profileUsername: params.profile
        }
        throw json(data, { status: 404 })
    }

    const { userId: profileOwnerId, userEmail: profileOwnerEmail, sectionOrder } = profile

    if (!profileOwnerId.includes(userId)) {
        const data: EditProfileCatchData = { profileOwnerEmail }
        throw json(data, { status: 401 })
    }

    if (!sectionOrder) {
        return json<SectionOrderData>({ sectionOrder: null })
    }

    return json<SectionOrderData>({
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
        const profile = await getProfileByUsername(params.profile, true);

        if (!profile) {
            const data = {
                profileUsername: params.profile
            }
            throw json(data, { status: 404 })
        }

        await updateSectionOrder({
            id: profile.id, sectionOrder: sectionOrder.toString()
        })
    }

    return json<SectionOrderData>({
        sectionOrder: null
    })
}

const ProfileEditPage = () => {
    const [searchParams] = useSearchParams();
    const fullscreen = searchParams.get("view") === "fullscreen" ?? undefined;

    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(!fullscreen)
    const { sectionOrder } = useLoaderData<SectionOrderData>()

    const { downloadCanvasAsPNG } = useOutletContext<{
        downloadCanvasAsPNG: () => void,
    }>()

    return (
        <AlertDialog.Root open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen} >
            <div className="group flex flex-col gap-2 fixed bottom-6 left-6 print:hidden">
                <Form action="/logout" method="post" className="group-hover:block hidden">
                    <button
                        type="submit"
                        className="text-sm p-4 bg-white hover:bg-gray-200 border border-gray-300 dark:border-transparent dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600 text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white disabled:text-gray-700 items-center gap-1 rounded-full"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                        </svg>
                    </button>
                </Form>
                <button
                    type="button"
                    className="group-hover:flex hidden text-sm p-4 bg-white hover:bg-gray-200 border border-gray-300 dark:border-transparent dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600 text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white disabled:opacity-50 items-center gap-1 rounded-full"
                    onClick={() => print()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                    </svg>
                </button>
                <button
                    type="button"
                    className="group-hover:flex hidden text-sm p-4 bg-white hover:bg-gray-200 border border-gray-300 dark:border-transparent dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600 text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white disabled:opacity-50 items-center gap-1 rounded-full"
                    onClick={() => downloadCanvasAsPNG()}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5"
                    >
                        <path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 19h3v-2H5v-2H3v3a1 1 0 001 1zM19 4a1 1 0 00-1-1h-3v2h2v2h2V4zM5 5h2V3H4a1 1 0 00-1 1v3h2V5zM3 9h2v4H3zm14 0h2v3h-2zM9 3h4v2H9zm0 14h3v2H9z" />
                    </svg>
                </button>
                <AlertDialog.Trigger
                    className="group-hover:flex hidden text-sm p-4 bg-white hover:bg-gray-200 border border-gray-300 dark:border-transparent dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600 text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white disabled:opacity-50 items-center gap-1 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                    </svg>
                </AlertDialog.Trigger>
                <button
                    type="button"
                    className="text-sm p-4 bg-white hover:bg-gray-200 border border-gray-300 dark:border-transparent dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600 text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white disabled:opacity-50 flex items-center gap-1 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                </button>
            </div>
            <AlertDialog.Transition show={isAlertDialogOpen}>
                <AlertDialog.Content lg noPadding>
                    <div className="flex h-[95vh] sm:h-[75vh]">
                        <div className={
                            clsx(
                                "relative flex-none py-6",
                                isSidebarOpen ? "max-w-[70vw] sm:max-w-[200px] w-full border-r border-gray-200 dark:border-gray-700" : "w-fit"
                            )
                        }>
                            {
                                (isSidebarOpen) ? (
                                    <button
                                        type="button"
                                        className={clsx(
                                            "sm:hidden absolute top-4 right-4 inline-flex items-center justify-center rounded-full p-1",
                                            "focus-visible:ring focus-visible:outline-yellow-500 focus-visible:outline-opacity-75"
                                        )}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="
                                            flex items-center h-fit rounded-lg p-1 absolute m-auto
                                            bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700
                                            hover:text-gray-700 dark:hover:text-gray-200 text-gray-400 dark:text-gray-400
                                            -right-12 bottom-4 z-50
                                        "
                                        onClick={() => setIsSidebarOpen(true)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                        </svg>
                                    </button>
                                )
                            }
                            <div className={clsx(
                                !isSidebarOpen && "hidden",
                            )}>
                                <div className="pl-9 pr-6 py-1.5">
                                    <h3 className="text-xs text-gray-500 dark:text-gray-400">
                                        Profile
                                    </h3>
                                </div>
                                <Routes sectionOrder={sectionOrder} onRouteChange={() => {
                                    if (window.innerWidth < 640) {
                                        setIsSidebarOpen(false)
                                    }
                                }} />
                            </div>
                        </div>
                        <div className={
                            clsx(
                                "flex flex-col min-w-0 grow shrink-0 pt-8 [&>*]:px-8",
                                "divide-y divide-gray-200 dark:divide-gray-700",
                                "bg-white dark:bg-gray-800",
                                isSidebarOpen ? "rounded-r-2xl" : "rounded-2xl"
                            )
                        }>
                            <Outlet />
                        </div>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Transition>
        </AlertDialog.Root>
    )
}

export default ProfileEditPage