import { Link, useFetcher, useLoaderData, useOutletContext } from "@remix-run/react"
import { json } from "@remix-run/node"
import type { LoaderFunction } from "@remix-run/node"
import { getAllVolunteeringByUsername } from "~/models/volunteering.server"
import type { VolunteeringWithPostsIncluded } from "~/models/volunteering.server"
import { AlertDialog } from "~/components/radix"
import { EmptyVolunteering } from "~/images/empty"
import clsx from "clsx"
import { marked } from "marked"
import { sanitize } from 'isomorphic-dompurify';
import markdownToTxt from "markdown-to-txt"
import { ProfileEditPageOutletContext } from "~/routes/u/$profile/edit"

export type VolunteeringLoaderData = {
    volunteering: VolunteeringWithPostsIncluded
}

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    const volunteering = await getAllVolunteeringByUsername({
        profileUsername: params.profile
    })
    return json<VolunteeringLoaderData>({ volunteering });
}

const VolunteeringIndexPage = () => {
    const { volunteering } = useLoaderData<VolunteeringLoaderData>()
    const fetcher = useFetcher()
    const { sidebar: { openSidebar } } = useOutletContext<ProfileEditPageOutletContext>()

    return (
        <>
            <div className="mb-4 flex h-10 items-center justify-between gap-3">
                <h2 className="text-xl">
                    Volunteering
                </h2>
                <div>
                    <Link
                        to="new"
                        className="btn-secondary"
                    >
                        Add experience
                    </Link>
                </div>
            </div>
            <div className="overflow-y-auto scrollbar-hide flex flex-col flex-1 py-4 divide-y divide-gray-200 dark:divide-gray-700">
                {
                    volunteering.length > 0 ? (
                        volunteering.map(({
                            id,
                            from,
                            to,
                            title,
                            organization,
                            location,
                            url,
                            description,
                            posts,
                            published,
                        }) => (
                            <div className="flex gap-9 justify-between py-4" key={id}>
                                <div className="w-24 flex-none">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{(from === to) ? from : `${from} — ${to}`}</span>
                                </div>
                                <div className="flex flex-col grow shrink-0 w-min">
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {
                                            (url && published) ? (
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline hover:underline-offset-2 mr-1"
                                                >
                                                    {title}{organization && ` at ${organization}`}
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 inline-flex">
                                                        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                                    </svg>
                                                </a>
                                            ) : (
                                                <span className="mr-1">
                                                    {title}{organization && ` at ${organization}`}
                                                </span>
                                            )
                                        }
                                        {
                                            published ? (
                                                <span className="inline-flex text-green-500 text-xs font-medium">
                                                    &#x2022; Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex text-yellow-500 text-xs font-medium">
                                                    &#x2022; Draft
                                                </span>
                                            )
                                        }
                                    </div>
                                    {
                                        (location) && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 break-words mt-1">
                                                {location}
                                            </p>
                                        )
                                    }
                                    {
                                        (description) && (
                                            <div
                                                className="prose prose-neutral prose-sm dark:prose-invert mt-3"
                                                dangerouslySetInnerHTML={{ __html: sanitize(marked(description)) }}
                                            />
                                        )
                                    }
                                    {
                                        (posts.length > 0) && (
                                            <div className="flex flex-col gap-1 mt-4">
                                                {
                                                    posts.map(({ postId, post }) => (
                                                        <div
                                                            className="flex gap-1 items-center justify-between"
                                                            key={postId}
                                                        >
                                                            <Link
                                                                to={`../posts/${postId}?by=volunteering`}
                                                                className="
                                                                    w-full
                                                                    rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 text-xs disabled:opacity-50
                                                                    bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700
                                                                    text-gray-700 hover:text-gray-900 dark:hover:text-white dark:text-gray-200
                                                                    focus-visible:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-500 focus-visible:outline-offset-2 dark:focus-visible:bg-gray-600
                                                                "
                                                                key={postId}
                                                            >
                                                                <div>
                                                                    <span className="mr-1">{post.title}</span>
                                                                    {
                                                                        post.published ? (
                                                                            <span className="inline-flex text-green-500 text-xs font-medium">
                                                                                &#x2022; Published
                                                                            </span>
                                                                        ) : (
                                                                            <span className="inline-flex text-yellow-500 text-xs font-medium">
                                                                                &#x2022; Draft
                                                                            </span>
                                                                        )
                                                                    }
                                                                </div>
                                                                {(post.content) && (
                                                                    <p className="text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                                                        {sanitize(markdownToTxt(post.content))}
                                                                    </p>
                                                                )}
                                                            </Link>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                    <div className="flex items-center flex-wrap gap-1 mt-4">
                                        <Link
                                            to={`../posts/new?volunteeringId=${id}&by=volunteering`}
                                            className="
                                            flex-none
                                            rounded-lg border border-gray-200 px-2 py-1 text-xs disabled:opacity-50 dark:border-transparent
                                             bg-white hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600
                                             text-gray-700 hover:text-gray-900 dark:hover:text-white dark:text-gray-200
                                             focus-visible:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-500 focus-visible:outline-offset-2 dark:focus-visible:bg-gray-600"
                                        >
                                            + Page
                                        </Link>
                                    </div>
                                    <div className="flex gap-3 items-baseline mt-4">
                                        <fetcher.Form action={id} method="post">
                                            <input type="hidden" name="subaction" value={
                                                published ? "draft" : "publish"
                                            } />
                                            <button type="submit" className="text-xs text-gray-500 dark:text-gray-400 hover:underline hover:underline-offset-2">{
                                                published ? "Unpublish" : "Publish"
                                            }</button>
                                        </fetcher.Form>
                                        <div>
                                            <Link to={id} className="text-xs text-gray-500 dark:text-gray-400 hover:underline hover:underline-offset-2">Edit</Link>
                                        </div>
                                        <fetcher.Form
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
                                        </fetcher.Form>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={
                            clsx("flex flex-col items-center justify-center gap-4 h-full")
                        }>
                            <img src={EmptyVolunteering} alt="" width={200} height={200} className="dark:invert" />
                            <Link
                                to="new"
                                className="btn-secondary"
                            >
                                Add a volunteering role you had
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

export default VolunteeringIndexPage