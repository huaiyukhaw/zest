import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { ValidationBehaviorOptions } from 'remix-validated-form/dist/types/internal/getInputProps';
import { useField } from 'remix-validated-form';


export type SearchItem = {
    id: string,
    name: string
}

export type SearchItems = Array<SearchItem>

export interface SearchFieldProps extends Omit<React.ComponentProps<"select">, "id"> {
    label?: string;
    name: string;
    validationBehavior?: Partial<ValidationBehaviorOptions>;
    items: SearchItems
    formId?: string
}

export const SearchField: React.FC<SearchFieldProps> = ({ formId, label, name, validationBehavior, className = "flex-1", defaultValue, items, ...rest }) => {
    const { error, getInputProps } = useField(name, {
        ...(formId) && { formId },
        validationBehavior
    });

    const [query, setQuery] = useState('')

    const filteredItems =
        query === ''
            ? items
            : items.filter((item) =>
                item.name
                    .toLowerCase()
                    .replace(/\s+/g, '')
                    .includes(query.toLowerCase().replace(/\s+/g, ''))
            )

    return (
        <fieldset className={className}>
            <div className="flex justify-between">
                <div className="flex items-baseline gap-1.5">
                    <label htmlFor={name}>
                        {label}
                    </label>
                </div>
            </div>
            <div className="mt-1">
                <Combobox
                    {...getInputProps({
                        id: name,
                        ...rest,
                    })}>
                    <div className="relative w-full">
                        <Combobox.Input
                            className="
                                relative w-full cursor-default rounded-lg px-3 py-1.5
                                flex items-center gap-1.5 bg-white dark:bg-gray-700/50
                                border border-gray-500 dark:border-transparent focus-visible:outline-none
                                focus-visible:ring-2 focus-visible:ring-yellow-500
                                aria-[invalid]:border-red-800 aria-[invalid]:placeholder-red-300 aria-[invalid]:caret-red-500
                                aria-[invalid]:focus-visible:border-red-500 aria-[invalid]:focus-visible:outline-none aria-[invalid]:focus-visible:ring-red-500
                            "
                            displayValue={(item: SearchItem) => item.name}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                            </svg>
                        </Combobox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                            afterLeave={() => setQuery('')}
                        >
                            <Combobox.Options className="scrollbar-hide z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-2.5 shadow-lg text-sm">
                                {filteredItems.length === 0 && query !== '' ? (
                                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                        Nothing found.
                                    </div>
                                ) : (
                                    filteredItems.map((Item) => (
                                        <Combobox.Option
                                            key={Item.id}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 border border-gray-500 dark:border-transparent
                                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500
                                                ${active ? 'bg-gray-600/50 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-200'
                                                }`
                                            }
                                            value={Item}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                            }`}
                                                    >
                                                        {Item.name}
                                                    </span>
                                                    {selected ? (
                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900 dark:text-white">
                                                            <svg className="w-5 h-5" aria-hidden="true" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                                                            </svg>
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))
                                )}
                            </Combobox.Options>
                        </Transition>
                    </div>
                </Combobox>
            </div>
            {error ?
                <p className="mt-1 text-xs text-red-600 font-semibold" aria-live="polite">{error}</p> :
                <p className="mt-1 text-xs invisible">.</p>
            }
        </fieldset>
    )
}

export default SearchField