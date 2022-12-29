import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { Link, useFetcher, useLoaderData } from "@remix-run/react"
import clsx from "clsx"
import { AlertDialog } from "~/components/radix"
import { TagLabels } from "~/components/templates"
import { EmptyPost } from "~/images/empty"
import { getAllPostsByUsername } from "~/models/post.server"
import type { PostWithTags } from "~/models/post.server"
import { sanitize } from "isomorphic-dompurify"
import markdownToTxt from "markdown-to-txt"

export type PostsLoaderData = {
    posts: Array<PostWithTags>
}

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const posts = await getAllPostsByUsername({
        profileUsername: params.profile
    })

    return json<PostsLoaderData>({ posts });
}

const PostsIndexPage = () => {
    const { posts } = useLoaderData<PostsLoaderData>()
    const fetcher = useFetcher()

    return (
        <>
            <div className="mb-4 flex h-10 items-center justify-between gap-3">
                <h2 className="text-xl">
                    Posts
                </h2>
                <div>
                    <Link
                        to="new"
                        className="btn-secondary"
                    >
                        Write a post
                    </Link>
                </div>
            </div>
            <div className="overflow-y-auto scrollbar-hide flex flex-col flex-1 py-4 divide-y divide-gray-200 dark:divide-gray-700">
                {
                    posts.length > 0 ? (
                        posts.map(({
                            id,
                            title,
                            content,
                            tags,
                            published,
                            updatedAt
                        }) => (
                            <div key={id} className="flex flex-col py-4 -mx-4 px-4">
                                <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {
                                        <span className="mr-1">
                                            {title ?? "Untitled"}
                                        </span>
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
                                <p className="text-sm text-gray-500 dark:text-gray-400 break-words line-clamp-2 mt-1">
                                    {content ? sanitize(markdownToTxt(content)) : ""}
                                </p>
                                {(tags.length > 0) && (
                                    <TagLabels tags={tags} />
                                )}
                                <div className="flex justify-between items-baseline mt-4">
                                    <div className="flex gap-3 items-baseline">
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
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline-flex mb-0.5 mr-1 w-3 h-3">
                                            <path fillRule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clipRule="evenodd" />
                                        </svg>
                                        {
                                            new Intl
                                                .DateTimeFormat('us-EN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric'
                                                })
                                                .format(new Date(updatedAt))
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                        ))
                        : (
                            <div className={
                                clsx("flex flex-col items-center justify-center gap-4 h-full")
                            }>
                                <img src={EmptyPost} alt="" width={200} height={200} className="dark:invert" />
                                <Link
                                    to="new"
                                    className="btn-secondary"
                                >
                                    Write a post, tell your story
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

export default PostsIndexPage