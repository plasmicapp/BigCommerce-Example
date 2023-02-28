/*
  Forked from https://github.com/vercel/commerce/tree/main/packages/swell/src
  Changes: None
*/
import { CommerceError } from '@plasmicpkgs/commerce'
import { CartType } from '@plasmicpkgs/commerce'



import { CheckoutLinesAdd, CheckoutLinesUpdate, CheckoutCreate, CheckoutQuery, CheckoutLineDelete, Maybe } from '../schema'

import { normalizeCart } from '../lib/normalize'

export type CheckoutPayload =
  | CheckoutLinesAdd
  | CheckoutLinesUpdate
  | CheckoutCreate
  | CheckoutQuery
  | CheckoutLineDelete


const checkoutToCart = (checkoutPayload?: Maybe<CheckoutPayload>): CartType.Cart => {
  if (!checkoutPayload) {
    throw new CommerceError({
      message: 'Invalid response from BigCommerce',
    })
  }
  return normalizeCart(checkoutPayload as any)
}

export default checkoutToCart
