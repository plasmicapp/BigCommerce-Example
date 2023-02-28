import { useCallback } from 'react'
import type {
  MutationHookContext,
  HookFetcherContext,
} from '@plasmicpkgs/commerce'
import { ValidationError } from '@plasmicpkgs/commerce'
import { useRemoveItem, UseRemoveItem } from '@plasmicpkgs/commerce'
import type { Cart, LineItem, RemoveItemHook } from '../types/cart'
import useCart from './use-cart'
import { CART_COOKIE, CART_COOKIE_MAX_AGE } from '../const';
import Cookies from 'js-cookie'
import { normalizeCart } from '../lib/normalize'
import checkoutToCart from '../utils/checkout-to-cart'


export type RemoveItemFn<T = any> = T extends LineItem
  ? (input?: RemoveItemActionInput<T>) => Promise<Cart | null | undefined>
  : (input: RemoveItemActionInput<T>) => Promise<Cart | null>

export type RemoveItemActionInput<T = any> = T extends LineItem
  ? Partial<RemoveItemHook['actionInput']>
  : RemoveItemHook['actionInput']

export default useRemoveItem as UseRemoveItem<typeof handler>

export const handler = {
  fetchOptions: {
    url: '/v3/carts',
    method: 'DELETE',
  },
  async fetcher({
    input: { itemId },
    options,
    fetch,
  }: HookFetcherContext<RemoveItemHook>) {

    const cartId = Cookies.get(CART_COOKIE)
    if (!itemId || !cartId) {
      throw new ValidationError({
        message: 'Invalid input used for this operation',
      })
    }
    const { data } = await fetch({
      url: `/v3/carts/${cartId}/items/${itemId}?include=line_items.physical_items.options`,
      method: options.method,
      variables: {
        fetchOptions: 'storeApiFetch'
      }
    })


    const cookieOptions: Cookies.CookieAttributes = {
      expires: CART_COOKIE_MAX_AGE,
      sameSite: "none",
      secure: true
    }

    data ? Cookies.set(CART_COOKIE, data.id, cookieOptions) : Cookies.remove(CART_COOKIE)


    return normalizeCart(data)
  },
  useHook:
    ({ fetch }: MutationHookContext<RemoveItemHook>) =>
      <T extends LineItem | undefined = undefined>(ctx: { item?: T } = {}) => {
        const { item } = ctx
        const { mutate } = useCart()
        const removeItem: RemoveItemFn<LineItem> = async (input) => {
          const itemId = input?.id ?? item?.id

          if (!itemId) {
            throw new ValidationError({
              message: 'Invalid input used for this operation',
            })
          }

          const data = await fetch({ input: { itemId } })
          await mutate(data, false)
          return data
        }

        return useCallback(removeItem as RemoveItemFn<T>, [fetch, mutate])
      },
}
