import { Fragment } from "react";
import clsx from "clsx";
import { useControlField, useField } from "remix-validated-form";
import type { ValidationBehaviorOptions } from "remix-validated-form/dist/types/internal/getInputProps";
import { Listbox, Transition } from '@headlessui/react'

export type SelectOption = string

export type SelectOptions = Array<SelectOption>

export interface FormSelectProps extends Omit<React.ComponentProps<"select">, "id"> {
    label?: string;
    name: string;
    options: Array<SelectOption>
    validationBehavior?: Partial<ValidationBehaviorOptions>;
    className?: string
    formId?: string
    defaultIndex?: number
}

export const FormSelect: React.FC<FormSelectProps> = ({ formId, label, name, options, validationBehavior, className = "flex-1", defaultIndex = 0, ...rest }) => {
    const { error, getInputProps } = useField(name, {
        ... (formId) && { formId },
        validationBehavior
    });
    const [value, setValue] = useControlField<SelectOption>(name);

    return (
        <fieldset className={className}>
            <div className="flex justify-between">
                <label htmlFor={name}>
                    {label}
                </label>
            </div>
            <div className="mt-1">
                <Listbox
                    {...getInputProps({
                        value: value ?? options[defaultIndex],
                        onChange: setValue,
                        ...rest,
                    })}
                >
                    <div className="relative w-full">
                        <Listbox.Button
                            className="
                            relative w-full h-[34px] cursor-default rounded-lg px-3 py-1.5
                            flex items-center gap-1.5 bg-white dark:bg-gray-700/50
                            border border-gray-400 dark:border-transparent
                            focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-500
                            aria-[invalid]:border-red-800 aria-[invalid]:placeholder-red-300 aria-[invalid]:caret-red-500
                            aria-[invalid]:focus-visible:border-red-500 aria-[invalid]:focus-visible:outline-red-500
                            "
                        >
                            {
                                ({ value }: { value: SelectOption }) => (
                                    <>
                                        <span className="block truncate text-sm">{value}</span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600 dark:text-gray-400" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                                            </svg>
                                        </span>
                                    </>
                                )
                            }
                        </Listbox.Button>
                        <Transition
                            as={Fragment}
                            leave="transition ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="scrollbar-hide z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1.5 shadow-lg text-sm border border-gray-400 dark:border-transparent">
                                {options.map((option) => (
                                    <Listbox.Option
                                        key={option}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4
                                                focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-500
                                                ${active ? "bg-gray-300/50 dark:bg-gray-600/50 text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-200"
                                            }`
                                        }
                                        value={option}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                >
                                                    {option}
                                                </span>
                                                {selected ? (
                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600 dark:text-white">
                                                        <svg className="w-5 h-5" aria-hidden="true" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                                                        </svg>
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                        <div className={
                            clsx(
                                "transition absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none",
                                error ? "opacity-100 scale-100" : "opacity-0 scale-95"
                            )
                        }>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="h-5 w-5 fill-red-500"
                                aria-hidden
                            >
                                <path d="M11.953 2C6.465 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.493 2 11.953 2zM13 17h-2v-2h2v2zm0-4h-2V7h2v6z" />
                            </svg>
                        </div>
                    </div>
                </Listbox>
            </div>
            {error ?
                <p className="mt-1 text-xs text-red-600 font-semibold" aria-live="polite">{error}</p> :
                <p className="mt-1 text-xs invisible">.</p>
            }
        </fieldset>
    )
}

export default FormSelect