import type { Fetcher } from '@plasmicpkgs/commerce';
import { FetcherError } from '@plasmicpkgs/commerce';
import { BigCommerceCredentials } from './provider';


export const getFetcher:
  (creds: BigCommerceCredentials) => Fetcher = (creds) => {
    return async ({
      query,
      variables,
      url,
      method
    }) => {
      const res = await fetch("/api/hello", {
        method: "POST",
        body: JSON.stringify({
          query,
          variables,
          url,
          method,
          creds
        })
      });
      if (variables?.fetchOptions === 'storeApiFetch') {
        if (res.status === 204) {
          return null
        }
        const json = await res.json()
        return { data: json.data }
      }

      else if (variables?.fetchOptions === 'storeFrontApi') {
        const json = await res.json()
        if (json.errors) {
          throw new FetcherError({
            errors: json.errors ?? [{ message: 'Failed to fetch Bigcommerce API' }],
            status: res.status,
          })
        }
        return { data: json.data, res }
      }
    }
  }