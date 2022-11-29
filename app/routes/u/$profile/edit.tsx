import { useState } from "react"
import { LoaderFunction, json } from "@remix-run/node";
import { AlertDialog } from "~/components/radix";
import { requireUserId } from "~/session.server";
import { NavLink, Outlet } from "@remix-run/react";
import clsx from "clsx";
import { getProfileByUsernameOrThrow } from "~/models/profile.server";
import { EditProfileCatchData } from "../$profile";

const routes = [
    {
        label: "General",
        route: "./"
    },
    {
        label: "Projects",
        route: "projects"
    },
    {
        label: "Side Projects",
        route: "side-projects"
    },
    {
        label: "Exhibitions",
        route: "exhibitions"
    },
    {
        label: "Speaking",
        route: "speaking"
    },
    {
        label: "Writing",
        route: "writing"
    },
    {
        label: "Awards",
        route: "awards"
    },
    {
        label: "Features",
        route: "features"
    },
    {
        label: "Work Experience",
        route: "work-experience"
    },
    {
        label: "Volunteering",
        route: "volunteering"
    },
    {
        label: "Education",
        route: "education"
    },
    {
        label: "Certifications",
        route: "certifications"
    },
    {
        label: "Social Links",
        route: "links"
    },
]

export const loader: LoaderFunction = async ({
    request, params
}) => {
    if (!params.profile) throw new Error("Profile username not found")

    const userId = await requireUserId(request);
    const { userId: profileOwnerId, userEmail: profileOwnerEmail } = await getProfileByUsernameOrThrow(params.profile)
    if (!profileOwnerId.includes(userId)) {
        const data: EditProfileCatchData = { profileOwnerEmail }
        throw json(data, { status: 401 })
    }

    return json({})
};

const ProfileEditPage = () => {
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false)

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
                            <ul>
                                {routes.map((item, index) => (
                                    <NavLink to={item.route} key={item.route}>
                                        {
                                            ({ isActive }) => (
                                                <li key={index} className={
                                                    clsx("hover:cursor-pointer hover:bg-gray-100/40 dark:hover:bg-gray-700/40 px-9 py-1.5 group/item",
                                                        isActive && "bg-gray-100 dark:bg-gray-700")
                                                }>
                                                    <span className={
                                                        clsx(
                                                            "text-sm text-gray-600 dark:text-gray-400 group-hover/item:text-gray-700 dark:group-hover/item:text-gray-200",
                                                            isActive && "text-gray-700 dark:text-gray-200"
                                                        )
                                                    }>
                                                        {item.label}
                                                    </span>
                                                </li>
                                            )
                                        }
                                    </NavLink>
                                ))}
                            </ul>
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