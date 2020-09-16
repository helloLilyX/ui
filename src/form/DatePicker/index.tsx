import React from 'react';
import { NullFieldBind, FormFieldProps, IFormFieldContext } from '../../internal/FormCommon/types';
import useFieldBindOrProps from '../../internal/FormCommon/hooks/useFieldBindOrProps';

import { withFormContext } from '../../internal/FormCommon/HOC/withFormContext';

import {
    ICommonComposition,
    Label, LabelProps,
    Help, HelpProps,
    Error, ErrorProps,
    Success, SuccessProps,
} from '../../internal/FormCommon/Components';

import Input, { InputProps } from './Input';

type Props = FormFieldProps<string> & {
    // Add your other top level props here.
    // foo: number
}

interface IDatePickerComposition extends ICommonComposition {
    /**
     * Wrapper around [react-datepicker](https://reactdatepicker.com/). 
     * 
     * This component will accept *most* props supported by react-datepicker
     * with the exception of the following for failing to meet accessibility standards:
     * 
     * ```ts
     * type DisabledReactDatePickerProps = 
     * 'customTimeInput' | 'timeInputLabel' | 'disabledKeyboardNavigation'
     *  | 'showMonthYearPicker' | 'showMonthYearDropdown' | 'monthsShown'
     *  | 'withPortal' | 'showQuarterYearPicker' | 'showTimeSelect'
     *  | 'showTimeSelectOnly' | 'todayButton' | 'showYearPicker'
     *  | 'onChange' | 'selected'
     *  ```
     * 
     * If you wish to use one of these, please submit a merge request with a patch that resolves the issues.
     */
    Input: React.FC<InputProps>
}

export const Context = React.createContext<IFormFieldContext<string>>({
    bind: new NullFieldBind<string>()
});

/**
 * Provides a date and (optional) time picker
 */
const DatePicker: React.FC<Props> & IDatePickerComposition = ({
    children,
    ...props
}) => {
    const { bind } = useFieldBindOrProps(props);

    return (
        <Context.Provider value={{ bind }}>
            {children}
        </Context.Provider>
    );
}

DatePicker.Input = Input;
DatePicker.Label = withFormContext<LabelProps>(Label, Context);
DatePicker.Help = withFormContext<HelpProps>(Help, Context);
DatePicker.Error = withFormContext<ErrorProps>(Error, Context);
DatePicker.Success = withFormContext<SuccessProps>(Success, Context);

export default DatePicker;