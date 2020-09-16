import React, { useContext } from 'react';
import { IFormFieldContext } from '../../../internal/FormCommon/types'

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
    /** Will automatically be provided by an HOC */
    context?: React.Context<IFormFieldContext<any>>;
}

const Label: React.FC<LabelProps> = (props) => {
    // Separate context from the other props (or else they are added as props to the component itself)
    const { context, ...otherProps } = props;
    const { bind } = useContext(context!);

    return (
        <label
            {...otherProps}
            htmlFor={bind.id}
            className={
                'custom-control-label' +
                (props.className ? ' ' + props.className : '')
            }
        >
            {props.children ?? bind.instructions}
        </label>
    );
}

export default Label;
