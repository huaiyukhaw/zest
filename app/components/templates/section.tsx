import { marked } from "marked"
import { sanitize } from 'isomorphic-dompurify';
import { Link } from "@remix-run/react";
import markdownToTxt from "markdown-to-txt";
import TagLabels from "./tagLabels";

type Item = {
    id: string,
    title: string,
    duration: string,
    subtitle?: string | null,
    caption?: string | null,
    url?: string | null
    description?: string | null,
    tags?: Array<{ value: string }>,
    posts?: Array<{
        id: string,
        slug: string,
        title: string | null,
        tags: Array<{ value: string }>,
        content: string | null,
    }>
}

interface SectionTemplateProps extends React.ComponentProps<"div"> {
    header: string,
    items: Item[]
}


export const SectionTemplate: React.FC<SectionTemplateProps> = ({ header, items, ...rest }) => {
    return (
        <div {...rest}>
            <h2 className="mb-1 text-base font-medium text-gray-700 dark:text-gray-200">
                {header}
            </h2>
            <div className="overflow-y-auto scrollbar-hide flex flex-col flex-1">
                {
                    items.map(({
                        id, title, duration, subtitle, caption, url, description, posts, tags
                    }) => (
                        <div className="flex gap-6 justify-between items-baseline py-2 break-inside-avoid-page first:break-before-avoid-page" key={id}>
                            <div className="w-24 flex-none">
                                <span className="text-sm text-gray-500 dark:text-gray-400">{duration}</span>
                            </div>
                            <div className="flex flex-col grow shrink-0 w-min">
                                <div>
                                    <div
                                        className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                        {
                                            (url) ? (
                                                <a
                                                    href={url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:underline hover:underline-offset-2"
                                                >
                                                    {title}
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 inline-flex">
                                                        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                                                    </svg>
                                                </a>
                                            ) : (
                                                <span>
                                                    {title}
                                                </span>
                                            )
                                        }
                                    </div>
                                    {
                                        (subtitle) && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 break-words mt-1">
                                                {subtitle}
                                            </p>
                                        )
                                    }
                                    {
                                        (caption) && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 break-words line-clamp-2 mt-1">
                                                {caption}
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
                                        (posts && posts.length > 0) && (
                                            <div className="flex flex-col gap-1 mt-4 mx-1">
                                                {
                                                    posts.map(({ id, slug, title, tags, content }) => (
                                                        <Link
                                                            to={`/posts/${slug}`}
                                                            className="
                                                                    w-full
                                                                    rounded-lg border border-gray-200 dark:border-gray-700 px-4 -mx-5 py-3 disabled:opacity-50
                                                                    bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700
                                                                    focus-visible:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-500 focus-visible:outline-offset-2 dark:focus-visible:bg-gray-600
                                                                "
                                                            key={id}
                                                        >
                                                            <div className="text-sm font-medium text-gray-700 hover:text-gray-900 dark:hover:text-white dark:text-gray-200">
                                                                {title}
                                                            </div>
                                                            {
                                                                (content) && (
                                                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                                                        {sanitize(markdownToTxt(content))}
                                                                    </p>
                                                                )
                                                            }
                                                            {
                                                                (tags.length > 0) && (
                                                                    <TagLabels tags={tags} />
                                                                )
                                                            }
                                                        </Link>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                    {
                                        (tags && tags.length > 0) && (
                                            <TagLabels tags={tags} />
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SectionTemplate