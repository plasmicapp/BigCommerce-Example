import { SWRHook } from '@plasmicpkgs/commerce'
import { useProduct, UseProduct } from '@plasmicpkgs/commerce'
import { GetProductHook } from '@plasmicpkgs/commerce'
import { GetProductQueryVariables } from '../schema';
import { normalizeProduct } from '../lib/normalize'
import { getProductQuery } from '../utils/getProductQuery';
import setProductLocaleMeta from '../utils/set-product-locale-meta';
export default useProduct as UseProduct<typeof handler>;

export const handler: SWRHook<GetProductHook> = {
    fetchOptions: {
        query: getProductQuery,
    },
    async fetcher({ input, options, fetch, provider }) {
        const { id } = input

        const { data } = await fetch({
            query: options.query,
            variables: {
                entityId: parseInt(id as string),
                fetchOptions: 'storeFrontApi'
            }
        })
        const product = data.site?.product
        return product ? normalizeProduct(product as any) : null
    },
    useHook:
        ({ useData }) =>
            (input = {}) => {
                return useData({
                    input: [
                        ['id', input.id],
                    ],
                    swrOptions: {
                        revalidateOnFocus: false,
                        ...input.swrOptions,
                    },
                })
            },
}
