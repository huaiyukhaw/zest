type Item = {
    id: string,
    title: string,
    duration: string,
    subtitle?: string | null,
    url?: string | null
    description?: string | null,
}

interface SectionProps extends React.ComponentProps<"div"> {
    header: string,
    items: Item[]
}

export const Section: React.FC<SectionProps> = ({ header, items }) => {
    return (
        <div>
            <div className="mb-1 flex h-10 items-center justify-between gap-3">
                <h2 className="text-base font-medium text-gray-700 dark:text-gray-200">
                    {header}
                </h2>
            </div>
            <div className="overflow-y-auto scrollbar-hide flex flex-col flex-1 py-1">
                {
                    items.map(({
                        id, title, duration, subtitle, url, description
                    }) => (
                        <div className="flex gap-6 justify-between py-3" key={id}>
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
                                        )}
                                    {
                                        (description) && (
                                            <p className="text-sm text-gray-500 dark:text-gray-400 break-words whitespace-pre-wrap mt-3">
                                                {description}
                                            </p>
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

export default Section