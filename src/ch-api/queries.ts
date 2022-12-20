export const queryAssetByFolder = `
query queryAssetByFolder($folderId: String!, $after: String) {
  assetSearch(
    keyword: "*"
    first: 100
    filters: { assetFolderId: [$folderId] }
    sort: { updatedDate: DESC }
    after: $after
  ) {
    total
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        name
        label
      }
    }
  }
}`;

export const queryAssetByRepo = `
query queryAssetByFolder($repoId: String!, $after: String) {
  assetSearch(
    keyword: "*"
    first: 100
    filters: { assetRepositoryId: [$repoId] }
    sort: { updatedDate: DESC }
    after: $after
  ) {
    total
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        id
        name
        label
      }
    }
  }
}`;

// todo
const assetByQuery = ``;

export const assetEXIF = `
query assetEXIF($uuid: ID!) {
  node(id: $uuid) {
    id
    ... on Asset {
      id
      exifMetadata:metadata(schemaName: "exif") {
        edges {
          node {
            schemaName
            properties
          }
        }		
      }
    }
	}
}`;

export const repositories = `
query repositories($after: String) {
  viewer {
    mediaHubs {
      edges {
        node {
          assetRepositories(first: 50, after: $after) {
            pageInfo {
              endCursor
              hasNextPage
            }
            edges {
              node {
                id
                label
              }
            }
          }
        }
      }
    }
  }
}`;

export const foldersByRepo = `
query foldersByRepo($repoId: ID!, $after: String) {
  node(id: $repoId) {
    id
    ... on AssetRepository {
      assetFolders(first: 50, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            label
            children {
              id
              label
              children {
                id
                label
                children {
                  id
                  label
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

export const foldersByParent = `
query foldersByFolder($folderId: ID!) {
  node(id: $folderId) {
    id
    ... on AssetFolder {
      id
      label
      children {
        id
        label
        children {
          id
          label
          children {
            id
            label
          }
        }
      }
    }
	}
}`

export const exifByFolder = `
query exifByFolder($folderId: ID!, $after: String) {
  node(id: $folderId) {
    id
    ... on AssetFolder {
      id
      assets(first: 100, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            name
            label
            exifMetadata:metadata(schemaName: "exif") {
              edges {
                node {
                  schemaName
                  properties
                }
              }		
            }
          }
        }
      }
    }
	}
}`

export const exifByRepo = `
query exifByRepo($repoId: ID!, $after: String) {
  node(id: $repoId) {
    id
    ... on AssetRepository {
      id
      assets(first: 100, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        edges {
          node {
            id
            name
            label
            exifMetadata:metadata(schemaName: "exif") {
              edges {
                node {
                  schemaName
                  properties
                }
              }		
            }
          }
        }
      }
    }
	}
}`
