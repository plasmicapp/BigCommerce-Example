import { SWRHook, UseCategories, useCategories } from "@plasmicpkgs/commerce";
import { GetCategoriesHook } from "../types/site";
import { getCategoryQuery, getCategoriesQuery } from '../utils/getCategories';
import { normalizeCategory } from "../lib/normalize";
import { useMemo } from 'react';

export default useCategories as UseCategories<typeof handler>;


export const handler: SWRHook<GetCategoriesHook> = {
    fetchOptions: {
        query: getCategoriesQuery
    },
    async fetcher({ input, options, fetch }) {
        const { categoryId } = input
        if (!categoryId) {
            const { data } = await fetch({
                query: options.query,
                variables: {
                    fetchOptions: 'storeFrontApi'
                }
            })
            const categories = data.site.categoryTree.map(normalizeCategory)
            return categories
        } else {
            const data = await fetch({
                query: getCategoryQuery,
                variables: {
                    id: categoryId,
                    fetchOptions: 'storeFrontApi'
                },
            });
            return !!data?.site ? [normalizeCategory(data?.site)] : [];
        }
    },
    useHook: ({ useData }) => (input) => {
        const response = useData({
            input: [["categoryId", input?.categoryId]],
            swrOptions: { revalidateOnFocus: false, ...input?.swrOptions },
        });
        return useMemo(
            () =>
                Object.create(response, {
                    isEmpty: {
                        get() {
                            return (response.data?.length ?? 0) <= 0;
                        },
                        enumerable: true,
                    },
                }),
            [response]
        );
    },
};

