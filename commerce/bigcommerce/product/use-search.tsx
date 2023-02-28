import { SWRHook } from '@plasmicpkgs/commerce'
import { useSearch, UseSearch } from '@plasmicpkgs/commerce'
import type { SearchProductsHook } from '@plasmicpkgs/commerce'
import { getAllProductsQuery } from '../utils/getProductsQuery'
import { getSortVariables, } from '../utils/utils';
import filterEdges from '../utils/filter-edges';
import { RecursiveRequired } from '../utils/types';


import { normalizeProduct } from '../lib/normalize';
import { getProductsBySearch } from '../utils/getProductsBySearch'


export default useSearch as UseSearch<typeof handler>

export type SearchProductsInput = {
  search?: string
  categoryId?: number | string
  brandId?: number
  sort?: string
  locale?: string
}

export const handler: SWRHook<SearchProductsHook> = {
  fetchOptions: {
    query: getAllProductsQuery,
  },
  async fetcher({ input, options, fetch, provider, }) {
    const { count, sort, search, categoryId, brandId } = input
    let products
    const method = options?.method
  if (sort || categoryId || brandId || search || count) {
      const { data } = await fetch({
        query: getProductsBySearch,
        method,
        variables: {
          first: count,
          searchTerm: search ?? "",
          categoryId: parseInt(categoryId as string),
          sort: getSortVariables(sort),
          brandIds: brandId,
          fetchOptions: 'storeFrontApi'
        },
      })
      const edges = data?.site?.search?.searchProducts?.products?.edges
      products = filterEdges(edges as RecursiveRequired<typeof edges>[])
    }
    else {
      const { data } = await fetch({
        query: options.query,
        variables: {
          locale: provider?.locale,
          hasLocale: !!provider?.locale,
          first: count,
          method,
          fetchOptions: 'storeFrontApi'
        }
      })
      const edges = data?.site?.products?.edges
      products = filterEdges(edges as RecursiveRequired<typeof edges>[])
    }
    return {
      products: products.map(({ node }) => normalizeProduct(node)),
      found: !!products.length
    }
  },
  useHook:
    ({ useData }) =>
      (input = {}) => {
        return useData({
          input: [
            ['search', input.search],
            ['categoryId', input.categoryId],
            ['brandId', input.brandId],
            ['sort', input.sort],
            ['count', input.count]
          ],
          swrOptions: {
            revalidateOnFocus: false,
            ...input.swrOptions,
          },
        })
      },
}
