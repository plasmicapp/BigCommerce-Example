
import type { GetAllProductsOperation } from '../types/product'
export function getSortVariables(
    sort?: string
) {
    switch (sort) {
        case 'trending-desc':
            return 'BEST_SELLING'
        case 'latest-desc':
            return 'NEWEST'
        case "price-desc":
            return "HIGHEST_PRICE"
        case "price-asc":
            return "LOWEST_PRICE"
        default:
            return "RELEVANCE"

    }
}

export function getRawHeaders(res: Response) {
    const headers: { [key: string]: string } = {}

    res.headers.forEach((value, key) => {
        headers[key] = value
    })

    return headers
}

export function getTextOrNull(res: Response) {
    try {
        return res.text()
    } catch (err) {
        return null
    }
}
