import { useState, Fragment } from "react"
import { json } from "@remix-run/node";
import type { LoaderFunction, ActionFunction } from "@remix-run/node"
import { useOutletContext, useSubmit } from "@remix-run/react"
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Sidebar from "@radix-ui/react-dialog";
import { requireUserId } from "~/session.server";
import { Outlet, useLoaderData } from "@remix-run/react";
import { getProfileByUsername, updateSectionOrder } from "~/models/profile.server";
import type { EditProfileCatchData } from "~/routes/u/$profile";
import { Routes } from "~/components/navigation";
import { defaultRoutes } from "~/utils";
import type { RouteType } from "~/utils";
import clsx from "clsx";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Transition } from '@headlessui/react'

export type SectionOrderData = {
    sectionOrder: Array<RouteType> | null
}

export type ProfileEditPageOutletContext = {
    sidebar: {
        isSidebarOpen: boolean,
        openSidebar: () => void
    }
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
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true)
    const { sectionOrder } = useLoaderData<SectionOrderData>()
    const { downloadCanvasAsPNG } = useOutletContext<{
        downloadCanvasAsPNG: () => void,
    }>()
    const submit = useSubmit()

    return (
        <AlertDialog.Root open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen} >
            <DropdownMenu.Root>
                <DropdownMenu.Trigger className="fixed bottom-6 left-6 text-sm p-4 bg-white hover:bg-gray-200 border border-gray-300 dark:border-transparent dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600 text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white disabled:opacity-50 flex items-center gap-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        side="top"
                        sideOffset={5}
                        align="start"
                        className="
                                radix-side-top:animate-slide-up
                                group flex flex-col gap-2 print:hidden
                            "
                    >
                        <DropdownMenu.Item
                            className="
                                flex items-center gap-1 p-4 disabled:opacity-50 rounded-full cursor-pointer
                                border border-gray-300 dark:border-transparent
                                bg-white hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600
                                text-sm text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white
                            "
                            onSelect={
                                () => {
                                    if (confirm("Are you sure you want to logout?")) {
                                        submit(
                                            null,
                                            { method: "post", action: "/logout", replace: true }
                                        )
                                    }
                                }
                            }
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
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className="
                                flex items-center gap-1 p-4 disabled:opacity-50 rounded-full cursor-pointer
                                border border-gray-300 dark:border-transparent
                                bg-white hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600
                                text-sm text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white
                            "
                            onSelect={() => print()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
                            </svg>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item
                            className="
                                flex items-center gap-1 p-4 disabled:opacity-50 rounded-full cursor-pointer
                                border border-gray-300 dark:border-transparent
                                bg-white hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600
                                text-sm text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white
                            "
                            onSelect={() => downloadCanvasAsPNG()}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                            >
                                <path d="M19 14h-2v3h-3v2h3v3h2v-3h3v-2h-3zM4 19h3v-2H5v-2H3v3a1 1 0 001 1zM19 4a1 1 0 00-1-1h-3v2h2v2h2V4zM5 5h2V3H4a1 1 0 00-1 1v3h2V5zM3 9h2v4H3zm14 0h2v3h-2zM9 3h4v2H9zm0 14h3v2H9z" />
                            </svg>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item asChild>
                            <AlertDialog.Trigger
                                className="
                                    flex items-center gap-1 p-4 disabled:opacity-50 rounded-full
                                    border border-gray-300 dark:border-transparent
                                    bg-white hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600
                                    text-sm text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white
                                    "
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                                </svg>
                            </AlertDialog.Trigger>
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
            <Transition.Root show={isAlertDialogOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <AlertDialog.Overlay
                        forceMount
                        className="fixed inset-0 z-20 bg-black/50"
                    />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                >
                    <AlertDialog.Content
                        forceMount
                        className={clsx(
                            "fixed z-30 overflow-x-hidden",
                            "w-[95vw] max-w-3xl rounded-2xl md:w-full",
                            "top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]",
                            "bg-white dark:bg-gray-800",
                            "focus-visible:ring focus-visible:outline-yellow-500 focus-visible:outline-opacity-75",
                        )}
                    >
                        <div className="flex h-[95vh] sm:h-[75vh]">
                            <Sidebar.Root open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                                <Transition.Root show={isSidebarOpen} className="fixed z-40 inset-y-0 sm:static">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in duration-200 delay-500"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <Sidebar.Overlay
                                            forceMount
                                            className="fixed inset-0 z-40 bg-black/40 sm:hidden"
                                        />
                                    </Transition.Child>
                                    <Transition.Child
                                        as={Fragment}
                                        enter="transition ease-in-out duration-300 transform"
                                        enterFrom="-translate-x-full"
                                        enterTo="translate-x-0"
                                        leave="transition ease-in-out duration-300 transform delay-500"
                                        leaveFrom="translate-x-0"
                                        leaveTo="-translate-x-full"
                                    >
                                        <Sidebar.Content
                                            forceMount
                                            className={clsx(
                                                "fixed z-50",
                                                "w-screen max-w-[350px] sm:max-w-[200px] h-full",
                                                "sm:border-r border-gray-200 dark:border-gray-700",
                                                "drop-shadow-lg sm:drop-shadow-none",
                                                "inset-y-0 left-0",
                                                "bg-white dark:bg-gray-800",
                                                "relative flex-none py-6 rounded-l-2xl",
                                                "!pointer-events-auto"
                                            )}
                                        >
                                            <div>
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
                                                <div className="pl-9 pr-6 py-1.5">
                                                    <h3 className="text-xs text-gray-500 dark:text-gray-400">
                                                        Profile
                                                    </h3>
                                                </div>
                                                <Routes
                                                    sectionOrder={sectionOrder}
                                                    onRouteChange={() => {
                                                        if (window.innerWidth < 640) {
                                                            setIsSidebarOpen(false)
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </Sidebar.Content>
                                    </Transition.Child>
                                </Transition.Root>
                            </Sidebar.Root>
                            <div
                                className={
                                    clsx(
                                        "flex flex-col min-w-0 grow shrink-0 pt-8 [&>*]:px-8",
                                        "divide-y divide-gray-200 dark:divide-gray-700",
                                        "bg-white dark:bg-gray-800",
                                    )
                                }
                            >
                                <Outlet context={{
                                    sidebar: {
                                        isSidebarOpen,
                                        openSidebar: () => setIsSidebarOpen(true)
                                    }
                                }} />
                            </div>
                        </div>
                    </AlertDialog.Content>
                </Transition.Child>
            </Transition.Root>
        </AlertDialog.Root >
    )
}

export default ProfileEditPage

// Transition animation when toggling sidebar
// Maybe use headless ui transition