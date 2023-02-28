import { productConnectionFragment } from '../fragments/product'
export const getProductsBySearch = `
query($searchTerm:String,$categoryId:Int,$brandIds:[Int!],$sort:SearchProductsSortInput,$first:Int = 100){
    site{
      search{
        searchProducts(filters:{
          searchTerm:$searchTerm,
          categoryEntityId:$categoryId
          brandEntityIds:$brandIds
        },sort:$sort){
          products(first:$first){
            pageInfo {
              startCursor
              endCursor
            }
            edges {
              cursor
              node {
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
                  
                    }
                  }
                }
              }
            }
            }
          }
        }
      }
    }

`