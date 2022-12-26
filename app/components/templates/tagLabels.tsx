export type TagLabelsProps = {
    tags: Array<{ value: string }>
}

export const TagLabels: React.FC<TagLabelsProps> = ({
    tags
}) => {
    return (
        <div className="flex gap-1 mt-4">
            {tags.map(({ value }) => (
                <div
                    key={value}
                    className="
                        rounded text-xs px-2 py-1
                        bg-gray-300/50 dark:bg-gray-600/50 text-gray-700 dark:text-gray-200 print:border print:border-gray-400
                    "
                >
                    {value}
                </div>
            ))}
        </div>
    )
}

export default TagLabels