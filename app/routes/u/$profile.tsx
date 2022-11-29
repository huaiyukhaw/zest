import { Form, Link, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import { ThrownResponse } from "@remix-run/react"
import type { LoaderFunction, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node";
import { getProfileByUsername } from "~/models/profile.server";
import type { ProfileWithAllIncluded } from "~/models/profile.server"
import SadLemon from "~/images/sad.png"
import { ErrorFragment } from "~/components/boundaries";
import { Section } from "~/components/preview";

export type ProfileLoaderData = {
    profile: ProfileWithAllIncluded
}

export const meta: MetaFunction = ({ data }) => {
    return ({
        title: data?.profile?.displayName ?? "Remix CV"
    })
};

export type EditProfileCatchData = {
    profileOwnerEmail: string
}

export type ProfileCatchData = {
    profileUsername: string
}

export type ProfileThrownResponses = ThrownResponse | ThrownResponse<401, EditProfileCatchData> | ThrownResponse<404, ProfileCatchData>;

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.profile) {
        throw new Response("Profile username is missing", {
            status: 400,
        });
    }

    const profile = await getProfileByUsername(params.profile, true);

    if (!profile) {
        const data = {
            profileUsername: params.profile
        }
        throw json(data, { status: 404 })
    }

    return json({ profile });
}

const ProfilePage = () => {
    const { profile } = useLoaderData<ProfileLoaderData>();

    const {
        avatar,
        displayName,
        jobTitle,
        location,
        pronouns,
        website,
        bio,
        projects,
        sideProjects,
        exhibitions,
        speaking,
        writing,
        awards,
        features,
        workExperience,
        volunteering,
        education,
        certifications,
        links
    } = profile

    return (
        <>
            <div className="max-w-screen-sm mx-auto mt-4 mb-20 sm:mt-20 px-4">
                <div className="flex gap-6 mb-6 items-center">
                    {
                        avatar && JSON.parse(avatar).url && (
                            <img className="
                                group object-cover aspect-ratio h-24 w-24 rounded-full
                                flex flex-col items-center justify-center
                            "
                                src={JSON.parse(avatar).url}
                                alt="Avatar"
                            />
                        )
                    }
                    <div>
                        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-200">
                            {displayName}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 break-words whitespace-pre-wrap">
                            {jobTitle && jobTitle}{(jobTitle && location) && " at "}{location && location}{((jobTitle || location) && pronouns) && ", "}{pronouns && pronouns}
                        </p>
                        {
                            website && (
                                <div>
                                    <a
                                        href={website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-gray-500 dark:text-gray-400 break-words whitespace-pre-wrap mt-3 hover:underline hover:underline-offset-2"
                                    >
                                        {website}
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 inline-flex">
                                            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                        </svg>
                                    </a>
                                </div>
                            )
                        }
                    </div>
                </div>
                {
                    bio && (
                        <div className="mb-6">
                            <h2 className="text-base font-medium text-gray-700 dark:text-gray-200">
                                About
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 break-words whitespace-pre-wrap mt-3">
                                {bio}
                            </p>
                        </div>
                    )
                }
                {
                    projects.length > 0 && (
                        <Section header="Projects" items={
                            projects.map(({ id, title, year, company, url, description }) => ({
                                id,
                                title: `${title}${company ? ` at ${company}` : ""}`,
                                description,
                                duration: year,
                                url
                            }))
                        } />
                    )
                }
                {
                    sideProjects.length > 0 && (
                        <Section header="Side Projects" items={
                            sideProjects.map(({ id, title, year, company, url, description }) => ({
                                id,
                                title: `${title}${company ? ` at ${company}` : ""}`,
                                description,
                                duration: year,
                                url
                            }))
                        } />
                    )
                }
                {
                    exhibitions.length > 0 && (
                        <Section header="Exhibitions" items={
                            exhibitions.map(({ id, title, year, venue, location, url, description }) => ({
                                id,
                                title: `${title}${venue ? ` at ${venue}` : ""}`,
                                subtitle: location,
                                description,
                                duration: year,
                                url
                            }))
                        } />
                    )
                }
                {
                    speaking.length > 0 && (
                        <Section header="Speaking" items={
                            speaking.map(({ id, title, year, event, location, url, description }) => ({
                                id,
                                title: `${title}${event ? ` at ${event}` : ""}`,
                                subtitle: location,
                                description,
                                duration: year,
                                url
                            }))
                        } />
                    )
                }
                {
                    writing.length > 0 && (
                        <Section header="Writing" items={
                            writing.map(({ id, title, year, publisher, url, description }) => ({
                                id,
                                title: `${title}${publisher ? `, ${publisher}` : ""}`,
                                description,
                                duration: year,
                                url
                            }))
                        } />
                    )
                }
                {
                    awards.length > 0 && (
                        <Section header="Awards" items={
                            awards.map(({ id, title, year, presenter, url, description }) => ({
                                id,
                                title: `${title}${presenter ? ` from ${presenter}` : ""}`,
                                description,
                                duration: year,
                                url
                            }))
                        } />
                    )
                }
                {
                    features.length > 0 && (
                        <Section header="Features" items={
                            features.map(({ id, title, year, publisher, url, description }) => ({
                                id,
                                title: `${title}${publisher ? ` on ${publisher}` : ""}`,
                                description,
                                duration: year,
                                url
                            }))
                        } />
                    )
                }
                {
                    workExperience.length > 0 && (
                        <Section header="Work Experience" items={
                            workExperience.map(({ id, title, from, to, company, location, url, description }) => ({
                                id,
                                title: `${title} at ${company}`,
                                subtitle: location,
                                description,
                                duration: `${from} — ${to}`,
                                url
                            }))
                        } />
                    )
                }
                {
                    volunteering.length > 0 && (
                        <Section header="Volunteering" items={
                            volunteering.map(({ id, from, to, title, organization, location, url, description }) => ({
                                id,
                                title: `${title} at ${organization}`,
                                subtitle: location,
                                description,
                                duration: `${from} — ${to}`,
                                url
                            }))
                        } />
                    )
                }
                {
                    education.length > 0 && (
                        <Section header="Education" items={
                            education.map(({ id, from, to, degree, school, location, url, description }) => ({
                                id,
                                title: `${degree} at ${school}`,
                                subtitle: location,
                                description,
                                duration: `${from} — ${to}`,
                                url
                            }))
                        } />
                    )
                }
                {
                    certifications.length > 0 && (
                        <Section header="Certification" items={
                            certifications.map(({ id, issued, expires, name, organization, url, description }) => ({
                                id,
                                title: `${name} at ${organization}`,
                                description,
                                duration: `${issued}${expires === "Does not expire" ? "" : ` — ${expires}`}`,
                                url
                            }))
                        } />
                    )
                }
                {
                    links.length > 0 && (
                        <Section header="Social Links" items={
                            links.map(({ id, name, username, url }) => ({
                                id,
                                title: `${username ?? url}`,
                                duration: name,
                                url
                            }))
                        } />
                    )
                }
            </div>
            <Outlet />
        </>
    );
}

export const CatchBoundary = () => {
    const caught = useCatch<ProfileThrownResponses>();

    switch (caught.status) {
        case 401:
            return (
                <div className="h-screen">
                    <div className="flex flex-col items-center justify-center h-screen">
                        <img src={SadLemon} alt="" className="w-16 h-16" />
                        <div className="mt-4 z-20 text-xl font-semibold">You don't have access to edit this profile.</div>
                        <div className="mt-1 z-20">Contact <span className="font-semibold">
                            {caught.data.profileOwnerEmail}
                        </span> to get access</div>
                        <div className="mt-4 z-20">
                            <Link to="/" className="btn-secondary">Head back</Link>
                        </div>
                        <div className="absolute z-0 select-none opacity-[5%] filter transition duration-200 blur-sm">
                            <h1 className="text-[20rem] font-black">{caught.status}</h1>
                        </div>
                    </div>
                </div>
            );

        case 404:
            return (
                <div className="h-screen">
                    <div className="flex flex-col items-center justify-center h-screen">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-green-500 dark:text-green-400">
                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <div className="mt-4 z-20 text-xl font-semibold">{caught.data.profileUsername} is available!</div>
                        <div className="mt-8 z-20">
                            <Form action="/u">
                                <input type="hidden" name="username" value={caught.data.profileUsername} />
                                <button type="submit" className="btn-secondary px-4 py-2 text-base font-medium">Claim your profile</button>
                            </Form>
                        </div>
                    </div>
                </div>
            )

        default:
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
                            <h1 className="text-[20rem] font-black">{caught.status}</h1>
                        </div>
                    </div>
                </div>
            )
    }
}

export const ErrorBoundary = ({ error }: { error: Error }) => {
    return (
        <div className="h-screen">
            <ErrorFragment error={error} />
        </div>
    );
}

export default ProfilePage