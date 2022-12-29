import { Link, useFetcher, useLoaderData, useNavigate } from "@remix-run/react"
import { json } from "@remix-run/node"
import type { LoaderFunction } from "@remix-run/node"
import { getAllWritingByUsername } from "~/models/writing.server"
import type { WritingWithPostsIncluded } from "~/models/writing.server"
import { AlertDialog } from "~/components/radix"
import { EmptyWriting } from "~/images/empty"
import clsx from "clsx"
import { marked } from "marked"
import { sanitize } from 'isomorphic-dompurify';
import markdownToTxt from "markdown-to-txt"

export type WritingLoaderData = {
    writing: WritingWithPostsIncluded
}

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.profile) throw new Error("Profile username not found")
    const writing = await getAllWritingByUsername({
        profileUsername: params.profile
    })
    return json<WritingLoaderData>({ writing });
}

const WritingIndexPage = () => {
    const navigate = useNavigate();
    const { writing } = useLoaderData<WritingLoaderData>()
    const fetcher = useFetcher()

    return (
        <>
            <div className="mb-4 flex h-10 items-center justify-between gap-3">
                <h2 className="text-xl">
                    Writing
                </h2>
                <div>
                    <Link
                        to="new"
                        className="btn-secondary"
                    >
                        Add piece
                    </Link>
                </div>
            </div>
            <div className="overflow-y-auto scrollbar-hide flex flex-col flex-1 py-4 divide-y divide-gray-200 dark:divide-gray-700">
                {
                    writing.length > 0 ? (
                        writing.map(({
                            id,
                            title,
                            year,
                            publisher,
                            url,
                            description,
                            posts,
                            published
                        }) => (
                            <div className="flex gap-9 justify-between py-4" key={id}>
                                <div className="w-24 flex-none">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{year}</span>
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
                                                    {title}{publisher && `, ${publisher}`}
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 inline-flex">
                                                        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                                    </svg>
                                                </a>
                                            ) : (
                                                <span className="mr-1">
                                                    {title}{publisher && `, ${publisher}`}
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
                                        (description) && (
                                            <div
                                                className="prose prose-neutral prose-sm dark:prose-invert mt-1"
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
                                                                to={`../posts/${postId}?by=writing`}
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
                                            to={`../posts/new?writingId=${id}&by=writing`}
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
                            <img src={EmptyWriting} alt="" width={200} height={200} className="dark:invert" />
                            <Link
                                to="new"
                                className="btn-secondary"
                            >
                                Add something great you've written
                            </Link>
                        </div>
                    )
                }
            </div>
            <div className="dialog-footer">
                <AlertDialog.Cancel className="btn-secondary">
                    Done
                </AlertDialog.Cancel>
            </div>
        </>
    )
}

export default WritingIndexPage