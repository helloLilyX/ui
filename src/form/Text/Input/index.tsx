import React, { useContext } from 'react';
import { Context } from '..';
import FormContext from '../../../internal/FormCommon/FormContext';

import Print from '../Print';
import Diff from '../Diff';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Equivalent of `<input type='text'>`
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const { bind } = useContext(Context);
    const { isDiff, isPrint } = useContext(FormContext);

    const value = bind.value || props.defaultValue;

    if (isDiff) {
        return (
            <Diff
                value={typeof (value) === 'string' ? value : undefined}
                prevValue={typeof (bind.initialValue) === 'string' ? bind.initialValue : undefined}
            />
        )
    }

    if (isPrint) {
        return <Print value={typeof (value) === 'string' ? value : ''} />
    }

    const classNames = 'form-control ' +
        (props.className ?? '') +
        (bind.error ? ' is-invalid' : '') +
        (bind.success ? ' is-valid' : '')
        ;

    return (
        <input
            ref={ref}
            {...props}
            type="text"
            id={bind.id}
            name={bind.name || props.name}
            defaultValue={value}
            className={classNames}
            aria-describedBy={`${bind.id}-help`}
            onChange={(e) => {
                bind.value = e.currentTarget.value;
                if (props.onChange) props.onChange(e);
            }}
            readOnly={bind.readOnly || props.readOnly}
            required={bind.required || props.required}
        />
    );
});
