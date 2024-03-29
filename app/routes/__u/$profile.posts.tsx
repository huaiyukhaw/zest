import { json, type MetaFunction, Response, type LoaderFunction } from "@remix-run/node";
import { Link, type ThrownResponse, useCatch, useLoaderData } from "@remix-run/react";
import { sanitize } from "isomorphic-dompurify";
import markdownToTxt from "markdown-to-txt";
import { TagLabels } from "~/components/templates"
import { getAllPosts, type PostWithTags } from "~/models/post.server";
import { getProfileByUsername, type Profile } from "~/models/profile.server";
import { avatarSchema } from "~/validators";

type PostsLoaderData = {
    posts: PostWithTags[],
    profile: Profile
}

export const meta: MetaFunction = ({ data }) => {
    return ({
        title: data?.profile?.displayName ?? "Zest CV"
    })
};

export const loader: LoaderFunction = async ({ params }) => {
    if (!params.profile) throw new Error("Profile username not found")

    const profile = await getProfileByUsername(params.profile, true);

    if (!profile) {
        const data = {
            profileUsername: params.profile
        }
        throw json(data, { status: 404 })
    }

    const posts = await getAllPosts({
        published: true,
        ...(params.profile && {
            profileUsername: params.profile
        })
    })

    if (!posts) {
        throw new Response(`Posts about ${params.tag} not found`, { status: 404 })
    }

    return json<PostsLoaderData>({ posts, profile });
}

const PostsIndexPage = () => {
    const { posts, profile } = useLoaderData<PostsLoaderData>()

    let avatarUrl: string | null | undefined = null

    if (profile.avatar) {
        const parsedAvatar = avatarSchema.safeParse({ avatar: profile.avatar })
        if (parsedAvatar.success) {
            avatarUrl = parsedAvatar.data.avatar?.url.replace("upload/", "upload/c_fill,w_40/")
        }
    }

    return (
        <div className="max-w-screen-md mx-auto mt-4 mb-20 sm:mt-20 px-4">
            <div className="my-6 flex items-center gap-4">
                {
                    (avatarUrl) ? (
                        <img src={avatarUrl} alt={`${profile.displayName}'s avatar`} className="object-cover aspect-ratio w-10 h-10 rounded-full" />
                    ) : (
                        <div
                            className="
                                object-cover aspect-ratio w-12 h-12 rounded-full
                                flex flex-col items-center justify-center select-none
                                bg-gray-300 dark:bg-gray-600
                                text-xs font-semibold text-gray-400 dark:text-gray-500
                            "
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                    )
                }
                <h1 className="text-4xl font-semibold text-gray-700 dark:text-gray-200">
                    {profile.displayName}
                </h1>
            </div>
            <div className="pb-2 flex">
                <span className="pb-2 font-medium text-gray-700 dark:text-gray-200 border-b border-gray-500 dark:border-gray-400">
                    Latest posts
                </span>
                <div className="flex-1 border-b border-gray-200 dark:border-gray-700"></div>
            </div>
            {
                (posts.length > 0) ? (
                    <div className="flex flex-col my-2 mx-1 divide-y divide-gray-200 dark:divide-gray-700">
                        {
                            posts.map(({
                                id,
                                slug,
                                title,
                                tags,
                                content,
                                createdAt
                            }) => (
                                <div className="pt-6 pb-8" key={id}>
                                    <div className="flex gap-2 items-center mb-2">
                                        <p className="peer text-xs text-gray-500 dark:text-gray-400">
                                            {new Intl
                                                .DateTimeFormat('us-EN', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })
                                                .format(new Date(createdAt))}
                                        </p>
                                    </div>
                                    <Link to={`/post/${slug}`} className="group">
                                        <p
                                            className="text-lg font-semibold text-gray-700 dark:text-gray-200 group-hover:underline group-hover:underline-offset-2"
                                        >
                                            {title}
                                        </p>
                                        {
                                            (content) && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 break-words line-clamp-3 mt-1">
                                                    {sanitize(markdownToTxt(content))}
                                                </p>
                                            )
                                        }
                                    </Link>
                                    {
                                        (tags && tags.length > 0) && (
                                            <TagLabels tags={tags} />
                                        )
                                    }
                                </div>
                            ))
                        }
                    </div>
                ) : (
                    <div className="mt-4 text-center">
                        <p className="text-gray-500 dark:text-gray-400">No posts found</p>
                    </div>
                )
            }
        </div>
    )
}

export const CatchBoundary = () => {
    const caught = useCatch<ThrownResponse>();

    return (
        <div className="h-screen px-4 text-center flex flex-col items-center justify-center">
            <div className="mt-4 z-20 text-3xl font-bold">{caught.data}</div>
            <div className="mt-2 z-20">We couldn't find the posts you're looking for.</div>
            <div className="mt-4 z-20">
                <Link to="/" className="btn-secondary">Head back</Link>
            </div>
            <div className="absolute z-0 select-none opacity-[2%] filter transition duration-200 blur-[2px]">
                <h1 className="text-[20rem] font-black">{caught.status}</h1>
            </div>
        </div>
    )
}

export default PostsIndexPage