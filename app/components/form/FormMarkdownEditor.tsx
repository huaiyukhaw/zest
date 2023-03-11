import { useControlField, useField } from "remix-validated-form";
import type { ValidationBehaviorOptions } from "remix-validated-form/dist/types/internal/getInputProps";
import MDEditor from "@uiw/react-md-editor";
import type { MDEditorProps } from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";

export interface FormMarkdownEditorProps extends Omit<MDEditorProps, "id" | "value" | "onChange"> {
    label?: string;
    name: string;
    validationBehavior?: Partial<ValidationBehaviorOptions>;
    formId?: string
}

export const FormMarkdownEditor: React.FC<FormMarkdownEditorProps> = ({ formId, label, name, className = "flex-1 flex flex-col", validationBehavior, previewOptions, ...rest }) => {
    const { error, getInputProps } = useField(name, {
        ... (formId) && { formId },
        validationBehavior: {
            ...validationBehavior
        }
    });
    const [value, setValue] = useControlField<string>(name, formId);

    return (
        <fieldset className={className}>
            <div className="mt-1 flex-1 overflow-y-auto border border-gray-300 dark:border-transparent rounded-lg">
                <MDEditor
                    value={value ?? ""}
                    onChange={(val) => setValue(val ?? "")}
                    previewOptions={previewOptions ?? {
                        rehypePlugins: [[rehypeSanitize]],
                        linkTarget: '_blank'
                    }}
                    aria-invalid={error ? true : undefined}
                    {...rest}
                />
                <input
                    {...getInputProps({
                        id: name,
                        type: "hidden",
                        value: value ?? "",
                    })}
                />
            </div>
            {error ?
                <p className="mt-1 text-xs text-red-600 font-semibold" aria-live="polite">{error}</p> :
                <p className="mt-1 text-xs invisible">.</p>
            }
        </fieldset>
    )
}

export default FormMarkdownEditor