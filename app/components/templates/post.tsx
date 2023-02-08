import { Link } from "@remix-run/react"
import { sanitize } from "isomorphic-dompurify"
import markdownToTxt from "markdown-to-txt"
import TagLabels from "./tagLabels"

interface PostPreviewProps {
    post: {
        id: string,
        slug: string,
        title: string | null,
        tags: Array<{ value: string }>,
        content: string | null,
    }
}

export const PostPreview = ({ post: {
    id,
    slug,
    title,
    tags,
    content,
} }: PostPreviewProps
) => {
    return (
        <div>
            <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
                <a
                    href={`/post/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:underline-offset-2"
                >
                    {title}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 inline-flex">
                        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                    </svg>
                </a>
            </div>
            {
                (content) && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 break-words line-clamp-2 mt-1">
                        {sanitize(markdownToTxt(content))}
                    </p>
                )
            }
            {
                (tags && tags.length > 0) && (
                    <TagLabels tags={tags} />
                )
            }
        </div>
    )
}