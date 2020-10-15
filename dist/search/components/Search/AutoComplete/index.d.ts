import React from 'react';
export interface SearchMethods {
    /**
     * Reset the search to what was supplied in the `defaultValue` prop
     */
    reset: () => void;
    /**
     * Clear the current search field and results.
     *
     * This will also unlock the search field to accept new
     * input from the user if it was previously locked.
     */
    clear: () => void;
    /**
     * Sets the selected search value
     *
     * @param {string} display A string that represents the full value that will be displayed in the search input
     * @param {any} value The complete value object
     */
    set: (display: string, value: any) => void;
}
interface SearchValue {
    display: string;
    value?: any;
}
export declare type Props = {
    /**
     * Provider ID - the ID of the SearchProvider
     */
    provider: string;
    /**
     * Preloaded value to start with when initializing the component
     */
    defaultValue?: SearchValue;
    /** Label text */
    label: string;
    /**
     * Label Mode
     *
     * `hidden` (default) - do not show the label
     *
     * `visible` - display the label above the search field
     *
     * `placeholder` - display the label as placeholder text in an accessible way
     */
    labelMode?: 'hidden' | 'visible' | 'placeholder';
    /**
     * Callable for when an item is selected from the search results, or the search is cleared.
     *
     * The callable receives the selected value
     */
    onChange?: (value: any) => void;
    /**
     * `onFocus` event delegated to the inner `input` element
     */
    onFocus?: () => void;
    /**
     * `onBlur` event delegated to the inner `input` element
     */
    onBlur?: () => void;
    /**
     * Can the search input be modified by the end user. Setting this to `true`
     * will also disable the user's ability to clear the selection.
     */
    readOnly?: boolean;
};
declare const AutoComplete: React.ForwardRefExoticComponent<Props & React.RefAttributes<SearchMethods>>;
export default AutoComplete;
//# sourceMappingURL=index.d.ts.map