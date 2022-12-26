import { forwardRef } from "react"
import clsx from "clsx";
import { useIsSubmitting } from "remix-validated-form";

export interface SubmitButtonProps extends React.ComponentProps<"button"> {
    formId?: string
}

export const SubmitButton = forwardRef<HTMLButtonElement, SubmitButtonProps>(({
    disabled,
    children,
    formId,
    className,
    type = "submit",
    ...rest
}, ref) => {

    const isSubmitting = useIsSubmitting(formId);

    return (
        <button
            ref={ref}
            disabled={disabled || isSubmitting}
            className={
                clsx(
                    "relative btn-secondary",
                    className
                )
            }
            form={formId}
            {...rest}
        >
            <div
                className={clsx(
                    isSubmitting ? "invisible" : "visible"
                )}
            >
                {children}
            </div>
            <span className={clsx(
                isSubmitting ? "visible" : "invisible",
                "absolute inset-0 h-full w-full flex items-center justify-center"
            )}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="animate-spin w-4 h-4 text-gray-800 dark:text-white"
                >
                    <path d="M2 11h5v2H2zm15 0h5v2h-5zm-6 6h2v5h-2zm0-15h2v5h-2zM4.222 5.636l1.414-1.414 3.536 3.536-1.414 1.414zm15.556 12.728l-1.414 1.414-3.536-3.536 1.414-1.414zm-12.02-3.536l1.414 1.414-3.536 3.536-1.414-1.414zm7.07-7.071l3.536-3.535 1.414 1.415-3.536 3.535z" />
                </svg>
            </span>
        </button>
    )
})

export default SubmitButton