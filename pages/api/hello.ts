import type { NextApiRequest, NextApiResponse } from 'next'
import { Fetcher } from '@plasmicpkgs/commerce';
import { BigCommerceCredentials } from '@/commerce/bigcommerce/provider';

export const isomorphicFetcher = async (args: Parameters<Fetcher>[0] & { creds: BigCommerceCredentials }) => {
  const {
    query,
    variables,
    url,
    method,
    creds
  } = args
  if (variables?.fetchOptions === 'storeApiFetch') {
    return fetch(creds.storeApiUrl + url, {
      method,
      headers: {
        "Content-Type": 'application/json',
        'X-Auth-Token': creds.storeApiToken,
        'X-Auth-Client': creds.storeApiClientId,
        "Accept": "application/json"
      },
    });
  } else {
    return fetch(creds.storeFrontApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${creds.storeFrontApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
  }
}

export default async function handler(
  req: NextApiRequest,
  nextRes: NextApiResponse
) {
  const args = JSON.parse(req.body);
  const res = await isomorphicFetcher(args);

  if (res.status === 204) {
    nextRes.status(204);
    return null
  }
  const json = await res.json();
  if (json.errors) {
    nextRes.status(500).json({ errors: json.errors })
    return ;
  }
  nextRes.status(200).json({ data: json.data, res });
  return ;
}