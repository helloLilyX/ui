import throttle from 'lodash/throttle';
import React, { useCallback, useContext, useRef, useState } from 'react';
import { Context, JsonObject } from '..';
import Icon from '../../../components/Icon';
import { Nullable } from '../../../internal/FormCommon/types';
import { useSearch } from '../../../search';

export type Props = {
    /**
     * Additional class names to add to the component
     */
    className?: string

    // value?: Nullable<JsonObject>

    /**
     * Initial value to populate the lookup in uncontrolled mode.
     *
     * Use the `onChange` prop of `Lookup` to get value updates.
     */
    defaultValue?: Nullable<JsonObject>

    resultRenderer: (result: JsonObject) => JSX.Element

    /**
     * If provided, this will be rendered in place of the default
     * message when there are no hits.
     *
     * Implement this to customize user feedback and provide
     * helpful search tips when the user cannot find what
     * they are looking for.
     */
    emptyRenderer?: () => JSX.Element

    resultJsonPath?: string

    hitsJsonPath?: string

    /**
     * Change handler for use with React Hook Form's `<Controller>`.
     *
     * **Do not use this directly. This is not supported for usage outside of RHF.**
     * **Use the `onChange` prop in `<Lookup>` instead.**
     */
    onChange?: (newValue: Nullable<JsonObject>) => void

    /**
     * Blur handler for use with React Hook Form's `<Controller>`.
     *
     * **Do not use this directly. This is not supported for usage outside of RHF.**
     */
    onBlur?: () => void

    /**
     * Controlled value for use with React Hook Form's `<Controller>`.
     *
     * **Do not use this directly. This is not supported for usage outside of RHF.**
     * **Use a combination of defaultValue and the `onChange` prop in `<Lookup>` instead.**
     */
    value?: Nullable<JsonObject>
}

/**
 * Lookup input
 */
const Input: React.FC<Props> = (props) => {
    const { bind, provider } = useContext(Context);
    const { terms, searching, error, results, setTerms } = useSearch(provider);

    console.debug('RHF stuff', props.onChange, props.onBlur, props.value);

    // const value = bind.value || props.defaultValue || props.value;

    // const readOnly = bind.readOnly || props.readOnly;
    // const required = bind.required || props.required;

    // // TODO: Diff support

    // // if (readOnly) {
    // //     return <Print value={typeof (value) === 'string' ? value : ''} />
    // // }

    const classNames = `
        form-control ${props.className ? props.className : ''}
        ${bind.error && ' is-invalid'}
        ${bind.success && ' is-valid'}
    `;

    let iconProps = { name: 'search', spin: false };
    if (searching) {
        iconProps = { name: 'spinner', spin: true };
    }
    else if (error) {
        iconProps = { name: 'exclamation-circle', spin: false };
    }

    // let inputProps: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> = {
    //     ref: ref,
    //     ...props,
    //     type: "text",
    //     id: bind.id,
    //     name: bind.name || props.name,
    //     defaultValue: value,
    //     className: classNames,
    //     'aria-describedby': `${bind.id}-help`,
    //     onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
    //         bind.value = e.currentTarget.value;
    //         if (props.onChange) props.onChange(e);
    //     },
    //     readOnly: readOnly,
    //     "aria-disabled": readOnly,
    //     "aria-required": required,
    //     "aria-invalid": bind.error ? true : false
    // }

    // // Assign a value to the input if it is controlled
    // if (bind.controlled) {
    //     inputProps.value = value
    // }

    // TODO: Flexible based on JSON Path.
    // Right now we assume it's always { hits: number, results: JsonObject[] }
    const typedResults = results ? results as { hits: number, results: JsonObject[] } : undefined;

    const totalHits = typedResults?.hits || 0;
    const hits: JsonObject[] = typedResults?.results || [];

    const [value, setValue] = useState<Nullable<JsonObject>>(() =>
        props.defaultValue ? props.defaultValue : null
    );

    const hasHits = terms.length > 0 && hits.length > 0;
    const hasNoHits = terms.length > 0 && !searching && totalHits < 1;
    const hasMoreHits = terms.length > 0 && !searching && totalHits > hits.length;
    const showResultsPane = !value && (hasHits || hasNoHits || error !== undefined);

    const setTermsThrottled = useCallback(
        throttle(terms => setTerms(terms), 750),
        [throttle]
    );

    const updateValue = (newValue: Nullable<JsonObject>) => {
        setValue(newValue);
        setTerms('');

        if (props.onChange) {
            props.onChange(newValue);
        }

        // Blur gets fired at the same time as onChange due to the
        // input either existing or not existing once a change happens.
        if (props.onBlur) {
            props.onBlur();
        }

        // Notify the bind and trigger onChange of the parent Lookup.
        bind.value = newValue;
    }

    // If this is a controlled component, we use props.value.
    // Otherwise we use the uncontrolled local value state.
    const renderedValue = props.value || value;
    return (
        <div className="input-group lookup-input">
            {/* Only show the search input if we have no selection */}
            {!value && <>

            <span className={`input-group-prefix ${error && 'text-danger'}`}>
                <Icon {...iconProps} />
            </span>

            <input
                type="text"
                id={bind.id}
                name={bind.name}
                className={classNames}
                onBlur={props.onBlur}
                onChange={(e) => {
                    setTermsThrottled(e.target.value);
                }}
            />
            </>}

            {/* Show the search value with a button to clear */}
            {renderedValue &&
            <div className="lookup-value">
                <div className="lookup-value-content">
                    {props.resultRenderer(renderedValue)}
                </div>

                <button className="lookup-value-clear" onClick={() => updateValue(null)}>
                    &times;
                </button>
            </div>
            }

            <div className="lookup-results">
                <div
                    id="TODO"
                    className="dropdown-menu"
                    role="listbox"
                    style={{display: showResultsPane ? 'block' : 'none'}}
                    tabIndex={-1}
                >
                    {error &&
                    <div className="dropdown-header lookup-error">
                        {error}
                    </div>
                    }

                    {hits.map((hit, idx) =>
                    <button type="button" key={idx} onClick={() => updateValue(hit)}>
                        {props.resultRenderer(hit)}
                    </button>
                    )}

                    {hasNoHits &&
                    <div className="dropdown-header">
                        There are no hits.
                        Try different search terms.
                    </div>
                    }

                    {hasMoreHits &&
                    <div className="dropdown-header">
                        There are <strong>{totalHits - hits.length}</strong> additional hits.
                        Refine your search terms.
                    </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default Input;
