import { json, LoaderFunction } from "@remix-run/node";
import { getPostWithProfile, PostWithProfile } from "~/models/post.server";
import { Link } from "react-router-dom";
import { ThrownResponse, useCatch, useLoaderData } from "@remix-run/react";
import MDEditor from '@uiw/react-md-editor';
import { avatarSchema } from "~/validators";
import { TagLabels } from "~/components/templates";

type PostLoaderData = {
    post: PostWithProfile
}

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.postId) {
        throw new Response("Post id is missing", {
            status: 400,
        });
    }

    const post = await getPostWithProfile(params.postId)

    if (!post) {
        throw new Response("Post not found", { status: 404 })
    }

    return json<PostLoaderData>({ post });
}

const PostPage = () => {
    const { post: { title, tags, content, profile, createdAt, updatedAt } } = useLoaderData<PostLoaderData>()

    let avatarUrl: string | null | undefined = null

    if (profile.avatar) {
        const parsedAvatar = avatarSchema.safeParse({ avatar: profile.avatar })
        if (parsedAvatar.success) {
            avatarUrl = parsedAvatar.data.avatar?.url
        }
    }

    return (
        <div className="max-w-screen-md mx-auto mt-4 mb-20 sm:mt-20 px-4">
            <div className="flex gap-2 items-center">
                {
                    (avatarUrl) ? (
                        <img src={avatarUrl} alt={`${profile.displayName}'s avatar`} className="object-cover aspect-ratio w-8 h-8 rounded-full" />
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
                <div>
                    <Link
                        to={`/u/${profile.username}`}
                        className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:underline hover:underline-offset-2"
                    >
                        {profile.displayName}
                    </Link>
                    <p className="peer text-xs text-gray-500 dark:text-gray-400">
                        Posted on {new Intl
                            .DateTimeFormat('us-EN', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })
                            .format(new Date(createdAt))}
                    </p>
                </div>
            </div>
            {
                (title) && (
                    <div>
                        <h1 className="text-5xl mt-6 mb-4 font-extrabold text-gray-700 dark:text-gray-200">
                            {title}
                        </h1>
                        <TagLabels tags={tags} />
                    </div>
                )
            }
            <div className="my-8">
                {
                    (content) && (
                        <MDEditor.Markdown source={content} />
                    )
                }
            </div>
            <div className="peer text-xs text-gray-500 dark:text-gray-400 mt-2">
                Last updated on {new Intl
                    .DateTimeFormat('us-EN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })
                    .format(new Date(updatedAt))}
            </div>
        </div>
    )
}

export const CatchBoundary = () => {
    const caught = useCatch<ThrownResponse>();

    return (
        <div className="h-screen px-4 text-center flex flex-col items-center justify-center">
            <div className="mt-4 z-20 text-3xl font-bold">{caught.data}</div>
            <div className="mt-2 z-20">We couldn't find the page you're looking for.</div>
            <div className="mt-4 z-20">
                <Link to="/" className="btn-secondary">Head back</Link>
            </div>
            <div className="absolute z-0 select-none opacity-[2%] filter transition duration-200 blur-[2px]">
                <h1 className="text-[20rem] font-black">{caught.status}</h1>
            </div>
        </div>
    )
}


export default PostPage