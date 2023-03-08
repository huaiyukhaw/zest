import { Form, Link, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import type { ThrownResponse } from "@remix-run/react"
import type { LoaderFunction, MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node";
import { getProfileByUsername } from "~/models/profile.server";
import type { ProfileWithAllIncluded } from "~/models/profile.server"
import { ErrorFragment } from "~/components/boundaries";
import { SectionTemplate } from "~/components/templates";
import { defaultRoutes } from "~/utils";
import markdownToTxt from "markdown-to-txt";
import { sanitize } from "isomorphic-dompurify";
import { useRef } from "react";
import html2canvas from "html2canvas"

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

    const profile = await getProfileByUsername(params.profile, true)

    if (!profile) {
        const data = {
            profileUsername: params.profile
        }
        throw json(data, { status: 404 })
    }

    return json<ProfileLoaderData>({ profile: profile as ProfileWithAllIncluded });
}

const ProfilePage = () => {
    const { profile } = useLoaderData<ProfileLoaderData>();

    const {
        username,
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
        links,
        posts,
        sectionOrder
    } = profile

    const sections = sectionOrder ? sectionOrder.split(",").map((id) => {
        const index = defaultRoutes.findIndex((route) => route.id === id)
        return defaultRoutes[index]
    }) : defaultRoutes

    const GeneralSection = () => (
        <div className="flex gap-6 mb-6 items-center">
            {
                (avatar && JSON.parse(avatar).url) ? (
                    <img className="
                                group object-cover aspect-ratio h-24 w-24 rounded-full
                                flex flex-col items-center justify-center
                            "
                        src={JSON.parse(avatar).url}
                        alt="Avatar"
                    />
                ) : null
            }
            <div>
                <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                    {displayName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 break-words whitespace-pre-wrap mt-1">
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
    )

    const BioSection = () => {
        return bio ? (
            <div>
                <h2 className="text-base font-medium text-gray-700 dark:text-gray-200">
                    About
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 break-words whitespace-pre-wrap mt-3">
                    {bio}
                </p>
            </div>
        ) : null
    }

    const ProjectSection = () => {
        return (projects.length > 0) ? (
            <SectionTemplate header="Projects" items={
                projects.map(({ id, title, year, company, url, description, posts }) => {
                    return ({
                        id,
                        title: `${title}${company ? ` at ${company}` : ""}`,
                        description,
                        duration: year,
                        url,
                        posts: posts ? posts.map(post => post.post).filter((post) => post.published) : []
                    })
                })
            } />
        ) : null
    }

    const SideProjectSection = () => {
        return (sideProjects.length > 0) ? (
            <SectionTemplate header="Side Projects" items={
                sideProjects.map(({ id, title, year, company, url, description, posts }) => ({
                    id,
                    title: `${title}${company ? ` at ${company}` : ""}`,
                    description,
                    duration: year,
                    url,
                    posts: posts ? posts.map(post => post.post).filter((post) => post.published) : []
                }))
            } />
        ) : null
    }

    const ExhibitionSection = () => {
        return (exhibitions.length > 0) ? (
            <SectionTemplate header="Exhibitions" items={
                exhibitions.map(({ id, title, year, venue, location, url, description, posts }) => ({
                    id,
                    title: `${title}${venue ? ` at ${venue}` : ""}`,
                    subtitle: location,
                    description,
                    duration: year,
                    url,
                    posts: posts ? posts.map(post => post.post).filter((post) => post.published) : []
                }))
            } />
        ) : null
    }

    const SpeakingSection = () => {
        return (speaking.length > 0) ? (
            <SectionTemplate header="Speaking" items={
                speaking.map(({ id, title, year, event, location, url, description, posts }) => ({
                    id,
                    title: `${title}${event ? ` at ${event}` : ""}`,
                    subtitle: location,
                    description,
                    duration: year,
                    url,
                    posts: posts ? posts.map(post => post.post).filter((post) => post.published) : []
                }))
            } />
        ) : null
    }

    const WritingSection = () => {
        return (writing.length > 0) ? (
            <SectionTemplate header="Writing" items={
                writing.map(({ id, title, year, publisher, url, description, posts }) => ({
                    id,
                    title: `${title}${publisher ? `, ${publisher}` : ""}`,
                    description,
                    duration: year,
                    url,
                    posts: posts ? posts.map(post => post.post).filter((post) => post.published) : []
                }))
            } />
        ) : null
    }

    const AwardSection = () => {
        return (awards.length > 0) ? (
            <SectionTemplate header="Awards" items={
                awards.map(({ id, title, year, presenter, url, description, posts }) => ({
                    id,
                    title: `${title}${presenter ? ` from ${presenter}` : ""}`,
                    description,
                    duration: year,
                    url,
                    posts: posts ? posts.map(post => post.post).filter((post) => post.published) : []
                }))
            } />
        ) : null
    }

    const FeatureSection = () => {
        return (features.length > 0) ? (
            <SectionTemplate header="Features" items={
                features.map(({ id, title, year, publisher, url, description, posts }) => ({
                    id,
                    title: `${title}${publisher ? ` on ${publisher}` : ""}`,
                    description,
                    duration: year,
                    url,
                    posts: posts ? posts.map(post => post.post).filter((post) => post.published) : []
                }))
            } />
        ) : null
    }

    const WorkExperienceSection = () => {
        return (workExperience.length > 0) ? (
            <SectionTemplate header="Work Experience" items={
                workExperience.map(({ id, title, from, to, company, location, url, description, posts }) => ({
                    id,
                    title: `${title} at ${company}`,
                    subtitle: location,
                    description,
                    duration: (from === to) ? from : `${from} — ${to}`,
                    url,
                    posts: posts ? posts.map(post => post.post).filter((post) => post.published) : []
                }))
            } />
        ) : null
    }

    const VolunteeringSection = () => {
        return (volunteering.length > 0) ? (
            <SectionTemplate header="Volunteering" items={
                volunteering.map(({ id, from, to, title, organization, location, url, description, posts }) => ({
                    id,
                    title: `${title} at ${organization}`,
                    subtitle: location,
                    description,
                    duration: (from === to) ? from : `${from} — ${to}`,
                    url,
                    posts: posts ? posts.map(post => post.post).filter((post) => post.published) : []
                }))
            } />
        ) : null
    }

    const EducationSection = () => {
        return (education.length > 0) ? (
            <SectionTemplate header="Education" items={
                education.map(({ id, from, to, degree, school, location, url, description, posts }) => ({
                    id,
                    title: `${degree} at ${school}`,
                    subtitle: location,
                    description,
                    duration: (from === to) ? from : `${from} — ${to}`,
                    url,
                    posts: posts ? posts.map(post => post.post).filter((post) => post.published) : []
                }))
            } />
        ) : null
    }

    const CertificationSection = () => {
        return (certifications.length > 0) ? (
            <SectionTemplate header="Certification" items={
                certifications.map(({ id, issued, expires, name, organization, url, description, posts }) => ({
                    id,
                    title: `${name} at ${organization}`,
                    description,
                    duration: `${issued}${expires === "Does not expire" ? "" : ` — ${expires}`}`,
                    url,
                    posts: posts ? posts.map(post => post.post).filter((post) => post.published) : []
                }))
            } />
        ) : null
    }

    const SocialLinkSection = () => {
        return (links.length > 0) ? (
            <SectionTemplate header="Social Links" items={
                links.map(({ id, name, username, url }) => ({
                    id,
                    title: `${username ?? url}`,
                    duration: name,
                    url
                }))
            } />
        ) : null
    }

    const PostSection = () => {
        return (posts.length > 0) ? (
            <div>
                <SectionTemplate
                    header="Posts"
                    items={
                        posts.map(({ id, slug, title, tags, content, updatedAt }) => ({
                            id,
                            title: title ?? "",
                            tags: tags,
                            caption: content ? sanitize(markdownToTxt(content)) : "",
                            duration: new Intl
                                .DateTimeFormat('us-EN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })
                                .format(new Date(updatedAt)),
                            url: `/post/${slug}`
                        }))
                    } />
                <div className="mt-4">
                    <Link to="/" className="text-sm text-gray-600 dark:text-gray-300  hover:text-gray-700 dark:hover:text-gray-200 hover:underline underline-offset-4">View all posts</Link>
                </div>
            </div>
        ) : null
    }

    const Sections: {
        [key: string]: () => JSX.Element | null
    } = {
        ProjectSection,
        SideProjectSection,
        ExhibitionSection,
        SpeakingSection,
        WritingSection,
        AwardSection,
        FeatureSection,
        WorkExperienceSection,
        VolunteeringSection,
        EducationSection,
        CertificationSection,
        SocialLinkSection,
        PostSection
    }

    const canvasRef = useRef<HTMLDivElement>(null)

    const downloadCanvasAsPNG = () => {
        if (canvasRef.current) {
            html2canvas(canvasRef.current, {
                scale: 3,
                backgroundColor: null,
                useCORS: true
            }).then((canvas) => {
                var dt = canvas.toDataURL('image/png', 1.0);
                /* Change MIME type to trick the browser to downlaod the file instead of displaying it */
                dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

                /* In addition to <a>'s "download" attribute, you can define HTTP-style headers */
                dt = dt.replace(/^data:application\/octet-stream/, `data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=${username}.png`);

                saveAs(dt, `${username}.png`);
            })
        }
    };

    const saveAs = (uri: string, filename: string) => {
        const link = document.createElement("a");
        if (typeof link.download === "string") {
            link.href = uri;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            window.open(uri);
        }
    };

    return (
        <>
            <div className="max-w-screen-sm mx-auto pt-4 pb-14 sm:pt-14 px-4 space-y-6 bg-white dark:bg-gray-800" ref={canvasRef}>
                <GeneralSection />
                <BioSection />
                {sections.map(({ id }) => {
                    const Section = Sections[id]
                    return <Section key={id} />
                })}
            </div>
            <Outlet context={{
                downloadCanvasAsPNG
            }} />
        </>
    );
}

export const CatchBoundary = () => {
    const caught = useCatch<ProfileThrownResponses>();

    switch (caught.status) {
        case 401:
            return (
                <div className="h-screen px-4 text-center flex flex-col items-center justify-center">
                    <div className="mt-4 z-20 text-3xl font-bold">You don't have access to edit this profile.</div>
                    <div className="mt-2 z-20">Contact <span className="font-semibold">
                        {caught.data.profileOwnerEmail}
                    </span> to get access</div>
                    <div className="mt-4 z-20">
                        <Link to="/" className="btn-secondary">Head back</Link>
                    </div>
                    <div className="absolute z-0 select-none opacity-[2%] filter transition duration-200 blur-[2px]">
                        <h1 className="text-[20rem] font-black">{caught.status}</h1>
                    </div>
                </div>
            );

        case 404:
            if (caught.data.profileUsername) {
                return (
                    <div className="h-screen px-4 text-center flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-green-500 dark:text-green-400">
                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                        <div className="mt-4 z-20 text-2xl font-bold">{caught.data.profileUsername} is available!</div>
                        <div className="mt-8 z-20">
                            <Form action="/app">
                                <input type="hidden" name="username" value={caught.data.profileUsername} />
                                <button type="submit" className="btn-secondary px-4 py-2 text-base font-medium">Claim your profile</button>
                            </Form>
                        </div>
                    </div>
                )
            }
            return (
                <div className="h-screen px-4 text-center flex flex-col items-center justify-center">
                    <div className="mt-4 z-20 text-2xl font-bold">{caught.data}</div>
                    <div className="mt-2 z-20">We couldn't find the page you're looking for!</div>
                    <div className="mt-4 z-20">
                        <Link to="/" className="btn-secondary">Head back</Link>
                    </div>
                    <div className="absolute z-0 select-none opacity-[5%] filter transition duration-200 blur-sm">
                        <h1 className="text-[20rem] font-black">{caught.status}</h1>
                    </div>
                </div>
            )

        default:
            return (
                <div className="h-screen px-4 text-center flex flex-col items-center justify-center">
                    <div className="mt-4 z-20 text-2xl font-bold">{caught.data}</div>
                    <div className="mt-2 z-20">We couldn't find the page you're looking for!</div>
                    <div className="mt-4 z-20">
                        <Link to="/" className="btn-secondary">Head back</Link>
                    </div>
                    <div className="absolute z-0 select-none opacity-[5%] filter transition duration-200 blur-sm">
                        <h1 className="text-[20rem] font-black">{caught.status}</h1>
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