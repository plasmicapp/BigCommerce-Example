import { useCallback } from 'react'


import { useAddItem, UseAddItem } from '@plasmicpkgs/commerce'
import { CommerceError, } from '@plasmicpkgs/commerce'
import type { MutationHook } from '@plasmicpkgs/commerce'
import type { AddItemHook } from '../types/cart'
import useCart from './use-cart'
import Cookies from 'js-cookie'
import { CART_COOKIE, CART_COOKIE_MAX_AGE } from '../const';
import { parseCartItem } from '../utils/parse-item'
import { normalizeCart } from '../lib/normalize'

import { CartItemBody } from '../types/cart';



export default useAddItem as UseAddItem<typeof handler>

export const handler: MutationHook<AddItemHook> = {
  fetchOptions: {
    url: '/v3/carts',
    method: 'POST',
  },
  async fetcher({ input: item, options, fetch }) {


    const cartId = Cookies.get(CART_COOKIE)
    const cookieOptions: Cookies.CookieAttributes = {
      expires: CART_COOKIE_MAX_AGE,
      sameSite: "none",
      secure: true
    }
    console.log(cartId);



    if (
      item.quantity &&
      (!Number.isInteger(item.quantity) || item.quantity! < 1)
    ) {
      throw new CommerceError({
        message: 'The item quantity has to be a valid integer greater than 0',
      })
    }
    const { data } = cartId ? await fetch({
      url: `${options.url}/${cartId}/items?include=line_items.physical_items.options,line_items.digital_items.options`,
      query: 'cart',
      method: options.method,
      body: JSON.stringify({
        lineItems: [parseCartItem(item as CartItemBody)]
      }),
      variables: {
        fetchOptions: 'storeApiFetch'
      }

    }
    ) : await fetch({
      url: `${options.url}?items?include=line_items.physical_items.options,line_items.digital_items.options`,
      query: 'cart-create',
      method: options.method,
      body: JSON.stringify({
        lineItems: [parseCartItem(item as CartItemBody)]
      }),
      variables: {
        fetchOptions: 'storeApiFetch'
      }
    })
    console.log(data);

    Cookies.set(CART_COOKIE, data.id, cookieOptions);

    return normalizeCart(data)
  },
  useHook:
    ({ fetch }) =>
      () => {
        const { mutate } = useCart()
        return useCallback(
          async function addItem(input) {
            const data = await fetch({ input })
            await mutate(data, false)
            return data
          },
          [fetch, mutate]
        )
      },
}
