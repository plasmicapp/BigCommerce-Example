import { useMemo } from 'react'
import { useCart as useCommerceCart, UseCart } from '@plasmicpkgs/commerce'
import { SWRHook } from '@plasmicpkgs/commerce'
import { GetCartHook } from '../types/cart'
import Cookies from 'js-cookie'
import getCartCookie from '../utils/get-cart-cookie';
import { CART_COOKIE, CART_COOKIE_MAX_AGE } from '../const';
import { normalizeCart } from '../lib/normalize';
import checkoutToCart from '../utils/checkout-to-cart'


export default useCommerceCart as UseCart<typeof handler>

export const handler: SWRHook<GetCartHook> = {
  fetchOptions: {
    url: '/v3/carts',
    method: 'GET',
  },
  async fetcher({ input: { cartId }, options, fetch }) {


    if (cartId) {

      const { data } = await fetch({
        url: `${options.url}/${cartId}?include=line_items.physical_items.options,line_items.digital_items.options`,
        method: options.method,
        variables: {
          fetchOptions: 'storeApiFetch'
        }
      })
      return normalizeCart(data)

    }
    return null

  },
  useHook:
    ({ useData }) =>
      (input) => {
        const response = useData({
          swrOptions: { revalidateOnFocus: false, ...input?.swrOptions },
        })
        return useMemo(
          () =>
            Object.create(response, {
              isEmpty: {
                get() {
                  return (response.data?.lineItems.length ?? 0) <= 0
                },
                enumerable: true,
              },
            }),
          [response]
        )
      },
}