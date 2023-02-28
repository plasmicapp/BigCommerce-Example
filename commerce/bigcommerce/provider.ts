
import { handler as useSearch } from './product/use-search'
import { handler as useProduct } from './product/use-product'
import { handler as useCategories } from './site/use-categories'
import { handler as useBrands } from './site/use-brands'
import { handler as useCart } from './cart/use-cart'
import { handler as useAddItem } from './cart/use-add-item'
import { handler as useUpdateItem } from './cart/use-update-item'
import { handler as useRemoveItem } from './cart/use-remove-item'
import { getFetcher } from './fetcher'
import { Fetcher } from '@plasmicpkgs/commerce'
import { CART_COOKIE, CART_COOKIE_MAX_AGE } from './const';


export interface BigCommerceCredentials {
  storeFrontApiUrl: string
  storeFrontApiToken: string
  storeApiUrl: string
  storeApiToken: string
  storeApiClientId: string
  storeApiClientSecret: string
  storeChannelId: number
  storeHash: string
  storeUrl: string
  clientName: string
}
const ONE_DAY = 60 * 60 * 24
export const getBigCommerceProvider = (creds: BigCommerceCredentials) => (
  {
    locale: 'en-us',
    applyLocale: true,
    cartCookie: CART_COOKIE,
    cartCookieMaxAge: CART_COOKIE_MAX_AGE,
    fetcher: getFetcher(creds),
    cart: { useCart, useAddItem, useUpdateItem, useRemoveItem },
    products: { useSearch, useProduct },
    site: { useCategories, useBrands }
  }
)

export type BigCommerceProvider = {
  locale: string;
  cartCookie: string;
  fetcher: Fetcher;
  cart: {
    useCart: typeof useCart;
    useAddItem: typeof useAddItem;
    useUpdateItem: typeof useUpdateItem;
    useRemoveItem: typeof useRemoveItem
  };
  products: {
    useSearch: typeof useSearch
    useProduct: typeof useProduct
  };

  site: {
    useCategories: typeof useCategories
    useBrands: typeof useBrands
  }
}
