import { useTransition } from "@remix-run/react";
import { useField } from "remix-validated-form";
import type { ValidationBehaviorOptions } from "remix-validated-form/dist/types/internal/getInputProps";

export interface FormImageInputProps extends Omit<React.ComponentProps<"input">, "id" | "type" | "accept"> {
    name: string;
    validationBehavior?: Partial<ValidationBehaviorOptions>;
    formId?: string
    showSpinner?: boolean
}

export const FormImageInput: React.FC<FormImageInputProps> = ({ formId, name, className = "flex-1", validationBehavior, showSpinner = true, ...rest }) => {
    const { error, getInputProps } = useField(name, {
        ... (formId) && { formId },
        validationBehavior: {
            ...validationBehavior
        }
    });
    const transition = useTransition()

    return (
        <fieldset className={className}>
            <label
                htmlFor={name}
                className="flex cursor-pointer flex-col items-center justify-center"
            >
                <div className="
                    group h-24 w-24 rounded-full px-4
                    flex flex-col items-center justify-center
                    border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600
                "
                >
                    {
                        transition.submission && showSpinner ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="animate-spin h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                            >
                                <path d="M2 11h5v2H2zm15 0h5v2h-5zm-6 6h2v5h-2zm0-15h2v5h-2zM4.222 5.636l1.414-1.414 3.536 3.536-1.414 1.414zm15.556 12.728l-1.414 1.414-3.536-3.536 1.414-1.414zm-12.02-3.536l1.414 1.414-3.536 3.536-1.414-1.414zm7.07-7.071l3.536-3.535 1.414 1.415-3.536 3.535z" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-6 w-6 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                            >
                                <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                                <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                            </svg>
                        )
                    }
                </div>
                <input
                    {...getInputProps({
                        id: name,
                        type: "file",
                        accept: "image/*",
                        className: "hidden",
                        ...rest,
                    })}
                />
            </label>
            {error ?
                <p className="mt-1 text-xs font-semibold text-red-600" aria-live="polite">{error}</p> :
                <p className="mt-1 text-xs font-semibold invisible">.</p>
            }
        </fieldset>
    )
}

export default FormImageInput