
import {
  getCommerceProvider as getCoreCommerceProvider,
  useCommerce as useCoreCommerce,
} from '@plasmicpkgs/commerce'
import { getBigCommerceProvider, BigCommerceProvider, BigCommerceCredentials } from './provider';

export type { BigCommerceProvider }

export const useCommerce = () => useCoreCommerce<BigCommerceProvider>()

export const getCommerceProvider = (creds: BigCommerceCredentials) =>
  getCoreCommerceProvider(getBigCommerceProvider(creds))

