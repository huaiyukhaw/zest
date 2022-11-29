import { useField } from "remix-validated-form";

export interface FormHiddenInputProps extends Omit<React.ComponentProps<"input">, "id" | "type"> {
    name: string;
    formId?: string
}

export const FormHiddenInput: React.FC<FormHiddenInputProps> = ({ formId, name, className = "flex-1", ...rest }) => {
    const { getInputProps } = useField(name, {
        ... (formId) && { formId }
    });

    return (
        <fieldset className={className}>
            <input
                {...getInputProps({
                    id: name,
                    type: "hidden",
                    ...rest,
                })}
            />
        </fieldset>
    )
}

export default FormHiddenInput