import { json, Response, type LoaderFunction } from "@remix-run/node";
import { Link, type ThrownResponse, useCatch, useLoaderData } from "@remix-run/react";
import { TagLabels } from "~/components/templates"
import { getAllTags } from "~/models/tag.server";

type TagsIndexLoaderData = {
    tags: {
        value: string;
    }[]
}

export const loader: LoaderFunction = async ({ params }) => {
    const tags = await getAllTags()

    if (!tags) {
        throw new Response(`Tags not found`, { status: 404 })
    }

    return json<TagsIndexLoaderData>({ tags });
}

const TagsIndexPage = () => {
    const { tags } = useLoaderData<TagsIndexLoaderData>()

    return (
        <div className="max-w-screen-md mx-auto mt-4 mb-20 sm:mt-20 px-4">
            <div className="flex items-baseline gap-4 my-6">
                <div className="rounded-full p-2 bg-gray-300/50 dark:bg-gray-600/50 text-gray-700 dark:text-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 -scale-x-100">
                        <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39 1.186 3.548.428a18.849 18.849 0 005.441-5.44c.758-1.16.492-2.629-.428-3.548l-9.58-9.581a3 3 0 00-2.122-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
                    </svg>
                </div>
                <h1 className="text-5xl font-extrabold text-gray-700 dark:text-gray-200">
                    Tags
                </h1>
            </div>
            <div className="pb-2 flex">
                <span className="pb-2 font-medium text-gray-700 dark:text-gray-200 border-b border-gray-500 dark:border-gray-400">
                    Latest tags
                </span>
                <div className="flex-1 border-b border-gray-200 dark:border-gray-700"></div>
            </div>
            <TagLabels tags={tags} />
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

export default TagsIndexPage