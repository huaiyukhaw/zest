import { Suspense, lazy, useEffect, useState } from "react";
import { useControlField, useField } from "remix-validated-form";
import type { ValidationBehaviorOptions } from "remix-validated-form/dist/types/internal/getInputProps";
import { type ReactQuillProps } from "react-quill"
import FormHiddenInput from "./FormHiddenInput";

let ReactQuill = lazy(() => import("react-quill"));

export const ClientOnly = ({ children }: { children: React.ReactNode }) => {
    let [mounted, setMounted] = useState<boolean>(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    return mounted ? <>{children}</> : null;
}


export interface FormQuillEditorProps extends Omit<ReactQuillProps, "id" | "value" | "onChange"> {
    label?: string;
    name: string;
    validationBehavior?: Partial<ValidationBehaviorOptions>;
    formId?: string
}

export const FormQuillEditor: React.FC<FormQuillEditorProps> = ({ theme = "bubble", formId, label, name, className = "flex-1 flex flex-col", validationBehavior, ...rest }) => {
    const { error, getInputProps } = useField(name, {
        ... (formId) && { formId },
        validationBehavior: {
            ...validationBehavior
        }
    });
    const [value, setValue] = useControlField<string>(name, formId);

    return (
        <fieldset className={className}>
            <div className="mt-1 flex-1">
                <ClientOnly>
                    <Suspense fallback="">
                        <ReactQuill
                            theme={theme}
                            value={value}
                            onChange={(val) => setValue(val ?? "")}
                            {...rest}
                        />
                    </Suspense>
                </ClientOnly>
                <input
                    {...getInputProps({
                        id: name,
                        type: "hidden",
                        value: value ?? "",
                    })}
                />
                <FormHiddenInput name="tags" value={undefined} />
                <FormHiddenInput name="by" value={undefined} />
            </div>
            {error ?
                <p className="mt-1 text-xs text-red-600 font-semibold" aria-live="polite">{error}</p> :
                <p className="mt-1 text-xs invisible">.</p>
            }
        </fieldset>
    )
}

export default FormQuillEditor