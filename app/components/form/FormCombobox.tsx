import { useControlField, useField } from "remix-validated-form";
import type { ValidationBehaviorOptions } from "remix-validated-form/dist/types/internal/getInputProps";
import CreatableSelect from 'react-select/creatable';

export type ComboboxOption = {
    value: string
}

export interface GroupedOption {
    readonly label: string;
    readonly options: readonly ComboboxOption[];
}

export type ComboboxOptions = ComboboxOption[] | GroupedOption[]

export interface FormComboboxProps {
    label?: string;
    name: string;
    options?: ComboboxOptions
    validationBehavior?: Partial<ValidationBehaviorOptions>;
    className?: string
    hideError?: boolean
    formId?: string
    onSelect?: () => void
    disabled?: boolean
}

export const FormCombobox: React.FC<FormComboboxProps> = ({
    formId,
    label,
    name,
    options = [],
    validationBehavior,
    className = "flex-1",
    hideError = false,
    onSelect,
    disabled = false
}) => {
    const { error } = useField(name, {
        ... (formId) && { formId },
        validationBehavior
    });
    const [values, setValues] = useControlField<readonly ComboboxOption[]>(name);

    return (
        <fieldset className={className}>
            <div className="flex justify-between">
                <label htmlFor={name}>
                    {label}
                </label>
            </div>
            <div className="mt-1">
                <CreatableSelect
                    name="tags"
                    options={options}
                    value={values}
                    onChange={(val) => {
                        if (onSelect) onSelect()
                        setValues(val)
                    }}
                    placeholder="Add tags..."
                    classNames={{
                        control: () => "!text-gray-300 dark:!text-gray-600 hover:!text-gray-600 dark:hover:!text-gray-400 !text-sm !bg-transparent dark:!bg-transparent !border-0 !shadow-none !cursor-text",
                        placeholder: () => "!text-sm !opacity-60",
                        input: () => "!text-sm !text-black dark:!text-white",
                        valueContainer: ({ hasValue }) => hasValue ? "!px-1.5" : "!px-3",
                        multiValue: () => "!bg-gray-300/50 dark:!bg-gray-600/50",
                        multiValueLabel: () => "!text-black dark:!text-white !cursor-default",
                        multiValueRemove: () => "!text-gray-400 dark:!text-gray-500 hover:!text-red-500 dark:hover:!text-red-600 hover:!bg-transparent",
                        indicatorSeparator: () => "!hidden !bg-gray-400 dark:!bg-gray-600",
                        indicatorsContainer: () => "!hidden !text-gray-400 dark:!text-gray-600",
                        dropdownIndicator: () => "!hidden !text-gray-400 dark:!text-gray-600",
                        loadingIndicator: () => "!hidden !text-gray-400 dark:!text-gray-600",
                        clearIndicator: () => "!hidden !text-gray-400 dark:!text-gray-600",
                        menu: () => "!rounded-lg !py-1.5 !text-sm !bg-white dark:!bg-gray-700 text-gray-600 dark:text-gray-200",
                        menuList: () => "scrollbar-hide",
                        option: ({ isSelected, isFocused }) => (isSelected || isFocused) ? "!bg-gray-300/50 dark:!bg-gray-600/50 !text-gray-900 dark:!text-white" : ""
                    }}
                    isMulti
                    getOptionLabel={(option) => option.value}
                    isDisabled={disabled}
                />
            </div>
            {
                (!hideError) && (
                    (error) ?
                        <p className="mt-1 text-xs font-semibold text-red-600" aria-live="polite">{error}</p> :
                        <p className="mt-1 text-xs font-semibold invisible">.</p>
                )
            }
        </fieldset>
    )
}

export default FormCombobox