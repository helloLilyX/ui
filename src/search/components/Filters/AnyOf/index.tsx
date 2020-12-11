
import React, { useContext } from 'react';
import { AnyOfFilter, anyOf } from '../../..';
import Checkbox from '../../../../form/Checkbox';
import { Context } from '..';

export type Props = {
    name: string
    options: string[]

    /** Title - must either be defined at the component level or in the parent `Filters.Group` */
    title?: string

    /**
     * Minimum options displayed before the clear button is also included.
     *
     * It's not included by default because it doesn't make sense for one or two options.
     */
    minimumOptionsForClearButton?: number
};

/**
 * Enumeration of options that get combined together into a single `AnyOf` filter.
 *
 * Only supports strings for keys.
 */
const AnyOf: React.FC<Props> = ({ name, options, title, minimumOptionsForClearButton = 5 }) => {
    const ctx = useContext(Context);
    const filter = ctx.getFilter<AnyOfFilter>(name);

    let values: string[] = [];
    if (filter) {
        const field = Object.keys(filter.anyOf)[0];
        values = filter.anyOf[field] as string[];
    }

    const onToggle = (entry: string, checked: boolean) => {
        const updated = values.filter((v) => v !== entry);
        if (checked) {
            updated.push(entry);
        }

        if (updated.length < 1) {
            ctx.deleteFilter(name);
        } else {
            ctx.addFilter(anyOf(name, updated, name));
        }
    };

    const onClear = () => {
        ctx.deleteFilter(name);
    }

    if (!title) {
        return <span className="text-danger">Title property not defined</span>
    }

    return (
        <div className="filters-any-of">
            <fieldset>
                <legend className="sr-only">{title}</legend>
                {options.map((entry) =>
                    <Checkbox
                        id={`${name}-${entry}`}
                        name={`${name}-${entry}`}
                        key={`anyOf-${name}-${entry}`}
                        onChange={checked => onToggle(entry, checked as boolean)}
                    >
                        <Checkbox.Input checked={values.indexOf(entry) >= 0} />

                        <Checkbox.Label>{entry}</Checkbox.Label>
                    </Checkbox>
                )}
            </fieldset>


            {options.length >= minimumOptionsForClearButton &&
                <button className="btn btn-link" onClick={onClear}>
                    Clear
                </button>
            }
        </div>
    );
}

export default AnyOf;
