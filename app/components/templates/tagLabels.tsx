import { Link } from "@remix-run/react"

export type TagLabelsProps = {
    tags: Array<{ value: string }> | string[]
}

export const TagLabels: React.FC<TagLabelsProps> = ({
    tags
}) => {
    return (
        <div className="flex flex-wrap gap-1 mt-4">
            {tags.map((tag) => {
                const value = typeof tag === "string" ? tag : tag.value
                return (
                    <Link
                        key={typeof tag === "string" ? tag : tag.value}
                        className="
                            rounded text-xs px-2 py-1 print:border print:border-gray-400
                            bg-gray-300/50 dark:bg-gray-600/50 text-gray-700 dark:text-gray-200
                            hover:bg-gray-300/70 dark:hover:bg-gray-600/70
                        "
                        to={`/tag/${value}`}
                    >
                        {value}
                    </Link>
                )
            })}
        </div>
    )
}

export default TagLabels