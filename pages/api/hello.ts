import type { NextApiRequest, NextApiResponse } from 'next'
import { FetcherError } from '@plasmicpkgs/commerce';

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  nextRes: NextApiResponse
) {
  const {
    query,
    variables,
    url,
    method,
    creds
  } = JSON.parse(req.body);
  const { locale, ...vars } = variables ?? {}
  if (variables?.fetchOptions === 'storeApiFetch') {
    const res = await fetch(creds.storeApiUrl + url, {
      method: method,
      headers: {
        "Content-Type": 'application/json',
        'X-Auth-Token': creds.storeApiToken,
        'X-Auth-Client': creds.storeApiClientId,
        "Accept": "application/json"
      },
    });
    if (res.status === 204) {
      nextRes.status(204);
      return null
    }
    const json = await res.json()
    nextRes.status(200).json({ data: json.data });
    return ;
  } else if (variables?.fetchOptions === 'storeFrontApi') {
    const res = await fetch(creds.storeFrontApiUrl, {
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
    const json = await res.json()
    if (json.errors) {
      nextRes.status(500).json({ errors: json.errors })
      return ;
    }
    nextRes.status(200).json({ data: json.data, res });
    return ;
  }
  nextRes.status(200).json({ name: 'John Doe' })
}
