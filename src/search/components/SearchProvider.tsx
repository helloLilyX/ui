
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
    SearchFilters,
    SearchContext,
    SearchTerms,
    SearchOffset,
    SearchLimit,
    SortFields,
    IFilter,
    ISearchContext,
    SearchDriver,
} from '..';

import {
    destroyDynamicContext,
    initDynamicContext
} from '../SearchContext';

export type Props = {
    /**
     * Unique identifier used by components to reference this provider.
     * This allows an application to use multiple entangled search providers
     */
    id: string

    /**
     * Default search terms to use when loading up the application.
     *
     * If `SyncSearchWithURL` is attached to this provider, the defaults
     * defined here will be overridden by the URL data.
     */
    defaultTerms?: SearchTerms

    /**
     * Default search filters to use when loading up the application.
     *
     * If `SyncSearchWithURL` is attached to this provider, the defaults
     * defined here will be overridden by the URL data.
     */
    defaultFilters?: SearchFilters

    /**
     * Default search offset to use when loading up the application.
     *
     * If `SyncSearchWithURL` is attached to this provider, the defaults
     * defined here will be overridden by the URL data.
     */
    defaultOffset?: SearchOffset

    /**
    * Default search limit to use when loading up the application.
    *
    * If `SyncSearchWithURL` is attached to this provider, the defaults
    * defined here will be overridden by the URL data.
    */
    defaultLimit?: SearchLimit

    /** The API integration driver to submit search data */
    driver: SearchDriver
}

/**
 * Provider for a named set of search filters and queries.
 *
 * All search components **must** be associated
 * with a provider to share state information.
 */
const SearchProvider: React.FC<Props> = ({
    id,
    defaultTerms = '',
    defaultFilters,
    defaultOffset = 0,
    defaultLimit = 20,
    driver,
    children
}) => {
    const [terms, setTerms] = useState<string>(defaultTerms);
    const [filters, setFilters] = useState<SearchFilters>(
        () => defaultFilters ? defaultFilters.clone() : new SearchFilters()
    );
    const [offset, setOffset] = useState<SearchOffset>(defaultOffset);
    const [limit, setLimit] = useState<SearchLimit>(defaultLimit);
    const [searching, setSearching] = useState(false);
    const [response, setResponse] = useState<unknown | undefined>();
    const [error, setError] = useState<string | undefined>();

    const ref = useRef<HTMLDivElement>(null);

    // Prepare for some magic.

    // The tl;dr: I'm dynamically creating named contexts stored in a
    // singleton map and providing each one mapped directly to a named (id) search provider.
    // This allows me to reuse a context structure for more than dataset, since each
    // provider needs its own unique set of search data to pass onto components.

    // Note that a change to `id` isn't supported here. Could potentially
    // add a useEffect on change but really it should be a usage error.
    // The callback argument for useState is done so that we don't overwrite an
    // existing provider (only executes init once when initially setting up the state)

    // We use `unknown` for typing here because the provider doesn't care what
    // structure the search results will be in (and shouldn't touch it anyway).
    // That's up to the implementing developer when they use the useSearchProvider hook.
    const [context,] = useState<SearchContext<unknown>>(
        () => initDynamicContext(id, {} as ISearchContext<unknown>)
    );

    // Destroy the dynamic context on unmount.
    useEffect(() => {
        return () => destroyDynamicContext(id);
    }, [id]);

    console.debug(`[SearchProvider(${id})] Redraw`, terms, filters);

    const contextValue = useMemo<ISearchContext<unknown>>(() => ({
        terms,
        filters: filters.filters,
        sort: filters.sort,
        offset,
        limit,
        searching,
        response,
        error,
        ref,
        setTerms,
        setSort(sort: SortFields | undefined) {
            setFilters((prev) => prev.sortBy(sort));
        },
        addFilter(filter: IFilter) {
            setFilters((prev) => prev.add(filter));
        },
        getFilter<T extends IFilter>(name: string, defaultValue?: T): T | undefined {
            return filters.get(name, defaultValue);
        },
        hasFilter(name: string): boolean {
            return filters.has(name);
        },
        deleteFilter(name: string) {
            setFilters((prev) => prev.delete(name));
        },
        replaceFilters(filters: IFilter[]) {
            setFilters(new SearchFilters(filters));
        },
        setOffset,
        setLimit,
        setSearching,
        setResponse,
        setError
    }), [terms, filters, offset, limit, searching, response, error]);

    const DriverComponent = driver;

    // Note this can't just be value={context} because we need to be
    // able to rewrite query/filters on state change.
    return (
        <context.Provider value={contextValue}>
            <div ref={ref}>
                <DriverComponent provider={id} />

                {children}
            </div>
        </context.Provider>
    );
}

export default SearchProvider;
