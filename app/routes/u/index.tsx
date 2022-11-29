import { useState } from "react"
import { json, redirect } from "@remix-run/node"
import type { LoaderFunction, ActionFunction } from "@remix-run/node"
import { requireUserId } from "~/session.server";
import { createProfile, getProfileListItems } from "~/models/profile.server";
import { Link, NavLink, useCatch, useLoaderData } from "@remix-run/react";
import { AlertDialog } from "~/components/radix";
import { ErrorFragment } from "~/components/boundaries";
import SadLemon from "~/images/sad.png";
import { ValidatedForm, validationError } from "remix-validated-form";
import { FormInput, SubmitButton } from "~/components/form";
import { profileClientValidator, profileServerValidator } from "~/validators";

type LoaderData = {
    profiles: Array<{
        id: string;
        username: string;
    }>
    claimUsername: string | undefined
}

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await requireUserId(request);
    const profiles = await getProfileListItems({ userId });

    const url = new URL(request.url);
    const devMode = url.searchParams.get("dev");
    const claimUsername = url.searchParams.get("username")

    if (claimUsername) {
        return json({
            profiles, claimUsername
        })
    }
    if (profiles.length === 1 && devMode !== process.env.DEV_SECRET) {
        return redirect(`/u/${profiles[0].username}`)
    }
    return json({ profiles })
}

export const action: ActionFunction = async ({
    request,
}) => {
    const userId = await requireUserId(request);

    const result = await profileServerValidator.validate(
        await request.formData()
    );

    if (result.error) return validationError(result.error);

    const { username, displayName } = result.data;

    const profile = await createProfile({ username, displayName, userId });
    return redirect(`/u/${profile.username}`)
};

const UserIndexPage = () => {
    const { profiles, claimUsername } = useLoaderData<LoaderData>()
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(() => (profiles.length == 0 || Boolean(claimUsername)))

    return (
        <div className="h-full w-60 border-r flex-col dark:border-gray-700">
            <div className="flex-1 overflow-y-auto">
                {profiles.length === 0 ? (
                    <p className="p-4">No profiles yet</p>
                ) : (
                    <ol>
                        {profiles.map((profile) => (
                            <li key={profile.id}>
                                <NavLink
                                    className={({ isActive }) =>
                                        `block border-b dark:border-gray-700 p-4 ${isActive ? "bg-white dark:bg-gray-700" : ""}`
                                    }
                                    to={profile.username}
                                >
                                    📝 {profile.username}
                                </NavLink>
                            </li>
                        ))}
                    </ol>
                )}
            </div>
            <AlertDialog.Root open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                <AlertDialog.Trigger
                    className="fixed h-fit bottom-6 left-6 text-sm px-4 py-3 bg-white hover:bg-gray-100 border border-gray-300 dark:border-transparent dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus-visible:bg-gray-600 dark:text-white disabled:opacity-50 flex items-center gap-1 rounded-full"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span className="font-medium text-sm">
                        New profile
                    </span>
                </AlertDialog.Trigger>
                <AlertDialog.Transition show={isAlertDialogOpen}>
                    <AlertDialog.Content>
                        <AlertDialog.Title className="dialog-title">
                            {
                                claimUsername ? "Claim your username 👋" : "Welcome to Zest 👋"
                            }
                        </AlertDialog.Title>
                        <AlertDialog.Description className="dialog-desc">
                            We just need a few details to finish creating your profile. You can always change this later.
                        </AlertDialog.Description>
                        <ValidatedForm validator={profileClientValidator} method="post" className="space-y-2">
                            <FormInput
                                name="username"
                                label="Username"
                                type="text"
                                autoFocus={true}
                                autoCapitalize="off"
                                spellCheck={false}
                                showSuccessIcon
                                maxLength={15}
                                transform={(value) => value.toLowerCase().trim()}
                            />
                            <FormInput
                                name="displayName"
                                label="Display name"
                                type="text"
                                showSuccessIcon
                                maxLength={48}
                            />
                            <div className="flex items-center justify-between">
                                <Link
                                    to="/"
                                    className="text-center text-xs text-gray-500 dark:text-gray-400 hover:underline underline-offset-2">
                                    Log in with a different email
                                </Link>
                                <AlertDialog.Cancel asChild>
                                    <SubmitButton>Continue</SubmitButton>
                                </AlertDialog.Cancel>
                            </div>
                        </ValidatedForm>
                    </AlertDialog.Content>
                </AlertDialog.Transition>
            </AlertDialog.Root>
        </div>
    )
}

export const CatchBoundary = () => {
    const caught = useCatch();

    return (
        <div className="h-screen">
            <div className="flex flex-col items-center justify-center h-screen">
                <img src={SadLemon} alt="" className="w-16 h-16" />
                <div className="mt-4 z-20 text-xl font-semibold">{caught.data}</div>
                <div className="mt-1 z-20">We couldn't find the page you're looking for!</div>
                <div className="mt-4 z-20">
                    <Link to="/" className="btn-secondary">Head back</Link>
                </div>
                <div className="absolute z-0 select-none opacity-[5%] filter transition duration-200 blur-sm">
                    <h1 className="text-[20rem] font-black">404</h1>
                </div>
            </div>
        </div>
    );
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
    return (
        <div className="h-screen">
            <ErrorFragment error={error} />
        </div>
    );
}

export default UserIndexPage