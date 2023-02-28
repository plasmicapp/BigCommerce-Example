

export const getCategoriesQuery = /* GraphQL */ `
  query getCategoriesInfo {
    site {
      categoryTree {
        entityId
        name
        path
        description
        productCount
      }
    }
  }
`


export const getCategoryQuery = /* GraphQL */ `
  query getCategoryInfo($id:Int!) {
    site {
      category(entityId:$id){
        entityId
        name
        path
        description
        productCount
      }
    }
  }
`