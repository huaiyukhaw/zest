import { useState } from "react"
import { json, redirect } from "@remix-run/node"
import type { LoaderFunction, ActionFunction } from "@remix-run/node"
import { requireUserId } from "~/session.server";
import { createProfile, getProfileListItems } from "~/models/profile.server";
import { Link, NavLink, useCatch, useLoaderData } from "@remix-run/react";
import { AlertDialog } from "~/components/radix";
import { ErrorFragment } from "~/components/boundaries";
import { ValidatedForm, validationError, setFormDefaults, useFormContext } from "remix-validated-form";
import type { FormDefaults } from "remix-validated-form"
import { FormInput, SubmitButton } from "~/components/form";
import { avatarSchema, profileClientValidator, profileServerValidator } from "~/validators";

type ProfilesLoaderData = {
    profiles: Array<{
        id: string;
        username: string;
        avatar: string | null
    }>
}

export const loader: LoaderFunction = async ({ request }) => {
    const userId = await requireUserId(request);
    const profiles = await getProfileListItems({ userId });

    const url = new URL(request.url);
    // const devMode = url.searchParams.get("dev");
    const claimUsername = url.searchParams.get("username")

    if (claimUsername) {
        return json<ProfilesLoaderData & FormDefaults>({
            profiles,
            ...setFormDefaults("newProfileForm", {
                username: claimUsername
            })
        })
    }

    // if (profiles.length === 1 && devMode !== process.env.DEV_SECRET) {
    //     return redirect(`/u/${profiles[0].username}`)
    // }

    return json<ProfilesLoaderData>({
        profiles
    })
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
    const { profiles } = useLoaderData<ProfilesLoaderData>()
    const { defaultValues } = useFormContext("newProfileForm")
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(() => (profiles.length == 0 || Boolean(defaultValues?.username)))

    return (
        <div className="h-screen flex flex-col justify-center bg-gray-300 dark:bg-gray-900">
            <div className="flex flex-col items-center gap-4 max-w-sm mx-auto py-4 rounded-xl bg-white dark:bg-gray-800 w-[95vw] md:w-full">
                <h2 className="text-lg font-semibold">
                    {
                        profiles.length === 0 ? (
                            "Get started"
                        ) : (profiles.length > 1) ? (
                            "Switch profiles"
                        ) : (
                            "Your profile"
                        )
                    }
                </h2>
                {profiles.length === 0 ? (
                    <p className="p-4">No profiles yet</p>
                ) : (
                    <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide max-w-sm w-full border-y border-gray-200 dark:border-gray-700">
                        {profiles.map((profile) => {
                            let avatarUrl: string | null | undefined = null

                            if (profile.avatar) {
                                const parsedAvatar = avatarSchema.safeParse({ avatar: profile.avatar })
                                if (parsedAvatar.success) {
                                    avatarUrl = parsedAvatar.data.avatar?.url
                                }
                            }
                            return (
                                <Link
                                    className="flex gap-2 items-center p-4 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    to={profile.username}
                                    key={profile.id}
                                >
                                    {
                                        (avatarUrl) ? (
                                            <img src={avatarUrl} alt={`${profile.username}'s avatar`} className="object-cover aspect-ratio w-8 h-8 rounded-full" />
                                        ) : (
                                            <div
                                                className="
                                                    object-cover aspect-ratio w-8 h-8 rounded-full
                                                    flex flex-col items-center justify-center select-none
                                                    bg-primary
                                                    text-white text-xs font-semibold
                                                "
                                            >
                                                HY
                                            </div>
                                        )
                                    }
                                    {profile.username}
                                </Link>
                            )
                        })}
                    </div>
                )}
                <AlertDialog.Root open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                    <AlertDialog.Trigger
                        className="mx-auto w-fit text-sm px-2 py-1 focus-visible:bg-gray-600 text-blue-500 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 disabled:opacity-50 flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span className="font-medium text-sm">
                            Create a new account
                        </span>
                    </AlertDialog.Trigger>
                    <AlertDialog.Transition show={isAlertDialogOpen}>
                        <AlertDialog.Content>
                            <AlertDialog.Title className="dialog-title">
                                {
                                    defaultValues?.username ? "Claim your username 👋" : "Welcome to Zest 👋"
                                }
                            </AlertDialog.Title>
                            <AlertDialog.Description className="dialog-desc">
                                We just need a few details to finish creating your profile. You can always change this later.
                            </AlertDialog.Description>
                            <ValidatedForm
                                validator={profileClientValidator}
                                method="post"
                                className="space-y-2"
                                id="newProfileForm"
                            >
                                <FormInput
                                    name="username"
                                    label="Username"
                                    type="text"
                                    autoFocus
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
                                <div className="flex items-center justify-between gap-2">
                                    <Link
                                        to="/"
                                        className="flex-1 text-xs text-gray-500 dark:text-gray-400 hover:underline underline-offset-2">
                                        Log in with a different email
                                    </Link>
                                    <SubmitButton className="w-fit">Continue</SubmitButton>
                                </div>
                            </ValidatedForm>
                        </AlertDialog.Content>
                    </AlertDialog.Transition>
                </AlertDialog.Root>
            </div>
        </div>
    )
}

export const CatchBoundary = () => {
    const caught = useCatch();

    return (
        <div className="h-screen px-4 text-center flex flex-col items-center justify-center">
            <div className="mt-4 z-20 text-3xl font-bold">{caught.data}</div>
            <div className="mt-2 z-20">We couldn't find the page you're looking for!</div>
            <div className="mt-4 z-20">
                <Link to="/" className="btn-secondary">Head back</Link>
            </div>
            <div className="absolute z-0 select-none opacity-[2%] filter transition duration-200 blur-[2px]">
                <h1 className="text-[20rem] font-black">{caught.status}</h1>
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