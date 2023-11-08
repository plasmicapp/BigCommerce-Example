import type { Fetcher } from '@plasmicpkgs/commerce';
import { FetcherError } from '@plasmicpkgs/commerce';
import { BigCommerceCredentials } from './provider';
import { isomorphicFetcher } from '@/pages/api/hello';


export const getFetcher:
  (creds: BigCommerceCredentials) => Fetcher = (creds) => {
    return async (args) => {
      const isClient = typeof window !== "undefined";
      let res: Response;
      if (isClient) {
        res = await fetch("/api/hello", {
          method: "POST",
          body: JSON.stringify({...args, creds})
        });
      } else {
        res = await isomorphicFetcher({...args, creds});
      }
      if (args.variables?.fetchOptions === 'storeApiFetch') {
        if (res.status === 204) {
          return null
        }
        const json = await res.json()
        return { data: json.data }
      } else if (args.variables?.fetchOptions === 'storeFrontApi') {
        const json = await res.json()
        if (json.errors) {
          throw new FetcherError({
            errors: json.errors ?? [{ message: 'Failed to fetch Bigcommerce API' }],
            status: res.status,
          })
        }
        return { data: json.data, res }
      }
      return null;
    }
  }