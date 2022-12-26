import clsx from "clsx";
import { useControlField, useField, useIsValid } from "remix-validated-form";
import type { ValidationBehaviorOptions } from "remix-validated-form/dist/types/internal/getInputProps";
import TextareaAutosize from 'react-textarea-autosize';
import type { TextareaAutosizeProps } from 'react-textarea-autosize';

export interface FormTextAreaProps extends Omit<TextareaAutosizeProps, "id" | "value" | "onChange"> {
    label?: string;
    name: string;
    validationBehavior?: Partial<ValidationBehaviorOptions>;
    showSuccessIcon?: boolean
    formId?: string
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({ formId, label, name, className = "flex-1", validationBehavior, maxLength, showSuccessIcon = false, minRows = 2, maxRows, ...rest }) => {
    const { error, getInputProps, touched } = useField(name, {
        ... (formId) && { formId },
        validationBehavior: {
            ...validationBehavior
        }
    });
    const isValid = useIsValid(formId)
    const [value, setValue] = useControlField<string>(name, formId);

    return (
        <fieldset className={className}>
            <div className="flex justify-between">
                <label
                    htmlFor={name}
                >
                    {label}
                </label>
                {maxLength && (
                    <span className="text-xs text-gray-500 font-medium">
                        {value ? value.length : 0} of {maxLength}
                    </span>
                )}
            </div>
            <div className="mt-1 relative flex">
                <TextareaAutosize
                    {...getInputProps({
                        id: name,
                        value: value ?? "",
                        onChange: (e) => setValue(e.target.value),
                        minRows,
                        maxRows,
                        maxLength,
                        ...rest,
                    })}
                    aria-invalid={error ? true : undefined}
                    className="scrollbar-hide resize-none"
                />
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
                {
                    showSuccessIcon && (
                        <div
                            className={clsx(
                                "transition absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none",
                                touched && (isValid || !error) ? "opacity-100 scale-100" : "opacity-0 scale-95"
                            )}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="h-5 w-5 fill-green-500"
                                aria-hidden
                            >
                                <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm-1.999 14.413-3.713-3.705L7.7 11.292l2.299 2.295 5.294-5.294 1.414 1.414-6.706 6.706z" />
                            </svg>
                        </div>
                    )
                }
            </div>
            {error ?
                <p className="mt-1 text-xs text-red-600 font-semibold" aria-live="polite">{error}</p> :
                <p className="mt-1 text-xs invisible">.</p>
            }
        </fieldset>
    )
}

export default FormTextArea