/**
 * Query assets by folder and query string. Does not contain exif data.
 */
export const queryAssetByFolder = `
query queryAssetByFolder($folderId: String!, $query: String, $after: String) {
  assetSearch(
    keyword: $query
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
        updatedDate
      }
    }
  }
}`;

/**
 * Query assets by repository. Does not contain exif data.
 */
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
        updatedDate
      }
    }
  }
}`;

/**
 * Get Exif Metadata for a single asset.
 */
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

/**
 * Repeating portion of a request for multiple assets with exif metadata.
 */
export const assetEXIFBuilder = `node(id: $uuid) {
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
	}`;

/**
 * Get repositories for the active client. Assumes less than 50 repositories.
 */
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

/**
 * Gets folders for a given repo, up to four levels deep.
 */
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

/**
 * Gets a folder and its child folders, up to three levels deep from the given folder.
 */
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

/**
 * Gets assets by folder, with their exif metadata.
 */
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
            updatedDate:createdDate
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

/**
 * Gets assets by repo, with their exif metadata.
 */
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
            updatedDate:createdDate
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
