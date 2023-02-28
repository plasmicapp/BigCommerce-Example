import { SWRHook, useBrands, UseBrands } from "@plasmicpkgs/commerce";
import { useMemo } from 'react';
import { getBrandsQuery } from '../utils/getBrands';
import filterEdges from '../utils/filter-edges';

export default useBrands as UseBrands<typeof handler>;

export const handler: SWRHook<any> = {
    fetchOptions: {
        query: getBrandsQuery
    },
    async fetcher({ input, options, fetch }) {
        const { data } = await fetch({
            query: options.query,
            variables: {
                fetchOptions: 'storeFrontApi'
            }

        })
        const brands = filterEdges(data.site?.brands?.edges)
        return Array.from(new Set(brands).values()).map((v: any) => ({
            entityId: v?.node?.entityId,
            name: v?.node?.name,
            path: `brands/${v?.node?.path}`,
        }));
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

