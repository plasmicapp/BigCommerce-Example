import { multipleChoiceOptionFragment } from '../fragments/product';
import { productInfoFragment } from '../fragments/product'

export const getProductQuery = /* GraphQL */ `
query getProduct($entityId:Int){
  site{
    product(entityId:$entityId){
      entityId
    name
    path
    brand {
      entityId
    }
    description
    prices {
      price {
      value
      currencyCode
     }
     salePrice {
      value
      currencyCode
     }
     retailPrice {
      value
      currencyCode
     }
    }
    images {
      edges {
        node {
          urlOriginal
          altText
          isDefault
        }
      }
    }
    variants(first: 250) {
      edges {
        node {
          entityId
          defaultImage {
            urlOriginal
            altText
            isDefault
          }
        }
      }
    }
    productOptions {
      edges {
        node {
          __typename
          entityId
          displayName
          ...multipleChoiceOption
        }
      }
    }
  
    }
  }
}
${multipleChoiceOptionFragment}
`
