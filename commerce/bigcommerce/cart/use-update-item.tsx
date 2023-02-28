import { useCallback } from 'react'
import debounce from 'lodash/debounce'
import type {
  MutationHookContext,
  HookFetcherContext,
} from '@plasmicpkgs/commerce'
import { ValidationError } from '@plasmicpkgs/commerce'
import { useUpdateItem, UseUpdateItem } from '@plasmicpkgs/commerce'
import type { LineItem, UpdateItemHook } from '../types/cart'
import { handler as removeItemHandler } from './use-remove-item'
import useCart from './use-cart'
import Cookies from 'js-cookie'
import { CART_COOKIE, } from '../const';

import { CommerceError } from '@plasmicpkgs/commerce';
import { parseCartItem } from '../utils/parse-item'
import { normalizeCart } from '../lib/normalize';
import checkoutToCart from '../utils/checkout-to-cart';
import { BigcommerceCart, CartItemBody } from '../types/cart';


export type UpdateItemActionInput<T = any> = T extends BigcommerceCart
  ? Partial<UpdateItemHook['actionInput']>
  : UpdateItemHook['actionInput']

export default useUpdateItem as UseUpdateItem<typeof handler>

export const handler = {
  fetchOptions: {
    url: '/v3/carts',
    method: 'PUT',
  },
  async fetcher({
    input: { itemId, item },
    options,
    fetch,
  }: HookFetcherContext<UpdateItemHook>) {
    if (Number.isInteger(item.quantity)) {
      // Also allow the update hook to remove an item if the quantity is lower than 1
      if (item.quantity! < 1) {
        return removeItemHandler.fetcher({
          options: removeItemHandler.fetchOptions,
          input: { itemId },
          fetch,
        })
      }
    } else if (item.quantity) {
      throw new ValidationError({
        message: 'The item quantity has to be a valid integer',
      })
    }
    const cartId = Cookies.get(CART_COOKIE)

    const { data } = await fetch({
      url: `${options.url}/${cartId}/items/${itemId}?include=line_items.physical_items.options`,
      method: options.method,
      body: JSON.stringify({
        line_item: parseCartItem(item as CartItemBody),
      }),
      variables: {
        fetchOptions: 'storeApiFetch'
      }
    })
    return normalizeCart(data)
  },
  useHook:
    ({ fetch }: MutationHookContext<UpdateItemHook>) =>
      <T extends LineItem | undefined = undefined>(
        ctx: {
          item?: T
          wait?: number
        } = {}
      ) => {
        const { item } = ctx
        const { mutate } = useCart() as any

        return useCallback(
          debounce(async (input: UpdateItemActionInput<T>) => {
            const itemId = input.id ?? item?.id
            const productId = input.productId ?? item?.productId
            const variantId = input.productId ?? item?.variantId

            if (!itemId || !productId || !variantId) {
              throw new ValidationError({
                message: 'Invalid input used for this operation',
              })
            }

            const data = await fetch({
              input: {
                itemId,
                item: { productId, variantId, quantity: input.quantity },
              },
            })
            await mutate(data, false)
            return data
          }, ctx.wait ?? 500),
          [fetch, mutate]
        )
      },
}