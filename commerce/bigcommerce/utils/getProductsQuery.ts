import { productConnectionFragment } from '../fragments/product'
export const getAllProductsQuery = /* GraphQL */ `
  query getAllProducts(
    $hasLocale: Boolean = false
    $locale: String = "null"
    $entityIds: [Int!]
    $first: Int = 100
  ) {
    site {
      products(first: $first, entityIds: $entityIds){
        ...productConnnection
      }     
    }
  }

  ${productConnectionFragment}
`