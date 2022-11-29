import { useControlField } from "remix-validated-form"
import { fromYearRange, yearRange } from "~/utils"
import FormSelect from "./FormSelect"
import type { FormSelectProps, SelectOptions } from "./FormSelect"

export interface YearSelectProps extends Omit<FormSelectProps, "options"> {
    numberOfYear: number
    extraOption?: string
    afterOrEqualTo?: string
}

export const YearSelect: React.FC<YearSelectProps> = ({ numberOfYear, extraOption, afterOrEqualTo, ...rest }) => {
    let yearOptions: SelectOptions = yearRange(numberOfYear).map((year) => String(year))

    const [from] = useControlField<string>("from");
    const fromYear = parseInt(from)

    if (fromYear && afterOrEqualTo) {
        yearOptions = fromYearRange(fromYear).map((year) => String(year))
    }

    const options = [
        ...(extraOption) ? [extraOption] : [],
        ...yearOptions
    ]

    return (
        <FormSelect
            options={options}
            {...rest}
        />
    )
}

export default YearSelect