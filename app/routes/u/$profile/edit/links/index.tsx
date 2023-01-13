import { Form, Link, useLoaderData, useOutletContext } from "@remix-run/react"
import { json } from "@remix-run/node"
import type { LoaderFunction } from "@remix-run/node"
import type { Link as SocialLink } from "@prisma/client"
import { getAllLinksByUsername } from "~/models/link.server"
import { AlertDialog } from "~/components/radix"
import { EmptyLink } from "~/images/empty"
import clsx from "clsx"
import { ProfileEditPageOutletContext } from "~/routes/u/$profile/edit"

export type LinksLoaderData = {
    links: Array<SocialLink>
}

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    const links = await getAllLinksByUsername({
        profileUsername: params.profile
    })
    return json<LinksLoaderData>({ links });
}

const LinksIndexPage = () => {
    const { links } = useLoaderData<LinksLoaderData>()
    const { sidebar: { openSidebar } } = useOutletContext<ProfileEditPageOutletContext>()

    return (
        <>
            <div className="mb-4 flex h-10 items-center justify-between gap-3">
                <h2 className="text-xl">
                    Social Links
                </h2>
                <div>
                    <Link
                        to="new"
                        className="btn-secondary"
                    >
                        Add link
                    </Link>
                </div>
            </div>
            <div className="overflow-y-auto scrollbar-hide flex flex-col flex-1 py-4 divide-y divide-gray-200 dark:divide-gray-700">
                {
                    links.length > 0 ? (
                        links.map(({
                            id,
                            name,
                            username,
                            url,
                            published
                        }) => (
                            <div className="flex gap-9 justify-between py-4" key={id}>
                                <div className="w-24 flex-none">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{name}</span>
                                </div>
                                <div className="flex flex-col grow shrink-0 w-min">
                                    <div className={
                                        clsx(
                                            !published && "blur-[1.5px] select-none"
                                        )
                                    }>
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                            <a
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline hover:underline-offset-2"
                                            >
                                                {username ?? url}
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 inline-flex">
                                                    <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-baseline mt-4">
                                        <Form action={id} method="post">
                                            <input type="hidden" name="subaction" value={
                                                published ? "draft" : "publish"
                                            } />
                                            <button type="submit" className="text-xs text-gray-500 dark:text-gray-400 hover:underline hover:underline-offset-2">{
                                                published ? "Unpublish" : "Publish"
                                            }</button>
                                        </Form>
                                        <div>
                                            <Link to={id} className="text-xs text-gray-500 dark:text-gray-400 hover:underline hover:underline-offset-2">Edit</Link>
                                        </div>
                                        <Form
                                            action={id}
                                            method="post"
                                            onSubmit={(event) => {
                                                if (!confirm("Are you sure you want to // delete this item?")) {
                                                    event.preventDefault();
                                                }
                                            }
                                            }
                                        >
                                            <input type="hidden" name="subaction" value="delete" />
                                            <button type="submit" className="text-xs text-gray-500 dark:text-gray-400 hover:underline hover:underline-offset-2">Delete</button>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={
                            clsx("flex flex-col items-center justify-center gap-4 h-full")
                        }>
                            <img src={EmptyLink} alt="" width={200} height={200} className="dark:invert" />
                            <Link
                                to="new"
                                className="btn-secondary"
                            >
                                Let others know how to reach you
                            </Link>
                        </div>
                    )
                }
            </div>
            <div className="flex h-16 items-center gap-1.5 justify-between sm:justify-end">
                <button
                    type="button"
                    className="sm:hidden hover:text-gray-700 dark:hover:text-gray-200 text-gray-400 dark:text-gray-400"
                    onClick={openSidebar}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <AlertDialog.Cancel className="btn-secondary">
                    Done
                </AlertDialog.Cancel>
            </div>
        </>
    )
}

export default LinksIndexPage