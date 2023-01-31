import { GraphQLClient } from "../graphql-client";
import IChApi from "./i-ch-api";
import {
  queryAssetByFolder,
  assetEXIF,
  repositories,
  foldersByRepo,
  foldersByParent,
  exifByRepo,
  exifByFolder,
  assetEXIFBuilder,
} from "./queries";
import {
  AssetSearchItem,
  AssetWithExif,
  EnrichedRepository,
  ExifMetadataProperties,
  Folder,
  MetadataResult,
  Repository,
} from "./shared";

/**
 * GraphQL list edge
 */
interface Edge<T> {
  node: T;
  cursor?: string;
}

/**
 * GraphQL pagination info
 */
interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

/**
 * GraphQL list container
 */
interface List<T> {
  edges: Edge<T>[];
}

/**
 * GraphQL paginated container
 */
interface Paginated<T> extends List<T> {
  total: number;
  pageInfo: PageInfo;
}

/**
 * GraphQL Asset Search response
 */
interface FetchAssetSearch {
  assetSearch: Paginated<AssetSearchItem>;
}

/**
 * GraphQL Exif Metadata response contents
 */
interface FetchExifMetadataAsset {
  id: string;
  exifMetadata?: List<MetadataResult<ExifMetadataProperties>>;
}

/**
 * GraphQL Exif Metadata response
 */
interface FetchExifMetadata {
  node: FetchExifMetadataAsset;
}

/**
 * GraphQL Repositories response
 */
interface FetchRepositories {
  viewer: {
    mediaHubs: List<{
      assetRepositories: Paginated<Repository>;
    }>;
  };
}

/**
 * GraphQL Folder by Repo response
 */
interface FetchFoldersByRepo {
  node: {
    id: string;
    assetFolders: Paginated<Folder>;
  };
}

/**
 * GraphQL Folders by Parent response
 */
interface FetchFoldersByParent {
  node: Folder;
}

/**
 * GraphQL Asset with Exif response
 */
interface AssetWithExifGql extends AssetSearchItem {
  exifMetadata?: List<MetadataResult<ExifMetadataProperties>>;
}

/**
 * GraphQL Exif by Repo response
 */
interface FetchExifByRepo {
  node: {
    id: string;
    assets: Paginated<AssetWithExifGql>;
  };
}

/**
 * GraphQL Exif by Folder response
 */
interface FetchExifByFolder {
  node: {
    id: string;
    assets: Paginated<AssetWithExifGql>;
  };
}

/**
 * A Content Hub API Client that uses the GraphQL API.
 */
export class GqlChApi extends GraphQLClient implements IChApi {
  /**
   * Fetch Assets from with given repo, folder and query.
   * @param repoId Repository containing the assets
   * @param folderId Folder containing the assets
   * @param query Query filtering the assets
   * @param after Start cursor for pagination
   * @returns Exif Metadata correlating to the asset
   */
  async fetchAssetsByFolder(
    repoId: string,
    folderId: string,
    query: string | undefined,
    after?: string
  ): Promise<FetchAssetSearch> {
    return await this.fetch(queryAssetByFolder, {
      repoId,
      folderId,
      query,
      after,
    });
  }

  /**
   * Fetch Asset Exif metadata for a singular asset by ID.
   * @param uuid Asset ID to fetch metadata for
   * @returns Exif Metadata correlating to the asset
   */
  async fetchAssetEXIF(uuid: string): Promise<FetchExifMetadata> {
    return await this.fetch(assetEXIF, { uuid });
  }

  /**
   * Fetch Asset Exif metadata in batch given a list of asset IDs.
   * @param uuids List of Asset IDs to fetch metadata for
   * @returns A list of Exif Metadata correlating to each asset
   */
  async fetchAssetsEXIF(uuids: string[]): Promise<FetchExifMetadataAsset[]> {
    let request = `query assetEXIF${uuids.length}(`;

    for (let i = 0; i < uuids.length; i++) {
      request += `$asset${i}: ID!`;
      if (i < uuids.length - 1) {
        request += ", ";
      }
    }

    request += ") {\n";

    const params = {} as any;
    for (let i = 0; i < uuids.length; i++) {
      request += `  asset${i}:${assetEXIFBuilder.replace(
        "$uuid",
        `$asset${i}`
      )}\n`;
      params[`asset${i}`] = uuids[i];
    }

    request += "}";

    const response = await this.fetch(request, params);

    const result: FetchExifMetadataAsset[] = [];

    for (let i = 0; i < uuids.length; i++) {
      result[i] = response[`asset${i}`];
    }

    return result;
  }

  /**
   * Fetch Repositories.
   * @param after Start cursor for pagination
   * @returns Response containing repositories
   */
  async fetchRepositories(after?: string): Promise<FetchRepositories> {
    return await this.fetch(repositories, { after });
  }

  /**
   * Fetch a repository and its child folders.
   * @param repoId Repository ID to request
   * @param after Start cursor for pagination
   * @returns Response containing the requested repository and its folder children
   */
  async fetchFoldersByRepo(
    repoId: string,
    after?: string
  ): Promise<FetchFoldersByRepo> {
    return await this.fetch(foldersByRepo, { repoId, after });
  }

  /**
   * Fetch a folder and its children.
   * @param folderId Folder ID to request
   * @returns Response containing the requested folder and its children
   */
  async fetchFoldersByParent(folderId: string): Promise<FetchFoldersByParent> {
    return await this.fetch(foldersByParent, { folderId });
  }

  /**
   * Fetch assets with exif from a given folder.
   * @param repoId ID for repository to get assets from
   * @param after Start cursor for pagination
   * @returns Response containing assets with exif from the given repo
   */
  async fetchExifByRepo(
    repoId: string,
    after?: string
  ): Promise<FetchExifByRepo> {
    return await this.fetch(exifByRepo, { repoId, after });
  }

  /**
   * Fetch assets with exif from a given repo.
   * @param folderId ID for folder to get assets from
   * @param after Start cursor for pagination
   * @returns Response containing assets with exif from the given folder
   */
  async fetchExifByFolder(
    folderId: string,
    after?: string
  ): Promise<FetchExifByFolder> {
    return await this.fetch(exifByFolder, { folderId, after });
  }

  // ---

  /**
   * Helper method to get all resources from a paginated request.
   * @param getItems Method to fetch more items, passed the cursor for the page to request
   * @returns A flat list of the requested resource
   */
  async paginate<T>(
    getItems: (after?: string) => Promise<Paginated<T>>
  ): Promise<T[]> {
    const results: T[] = [];

    let lastPageInfo: PageInfo | undefined;
    do {
      const page = await getItems(lastPageInfo?.endCursor);

      if (!page) {
        return results;
      }

      results.push.apply(
        results,
        page.edges.map((edge) => edge.node)
      );

      lastPageInfo = page.pageInfo;
    } while (lastPageInfo.hasNextPage);

    return results;
  }

  /**
   * Get the folders for a repo from the GraphQL API
   * @param repoId Repository ID
   * @returns A list of folders for the repository
   */
  async allFoldersByRepo(repoId: string): Promise<Folder[]> {
    return await this.paginate(async (after?: string) => {
      return (await this.fetchFoldersByRepo(repoId, after)).node?.assetFolders;
    });
  }

  /**
   * Get Exif Metadata for a specific asset from the GraphQL API.
   * @param uuid The Asset ID
   * @returns The Exif Metadata for the asset
   */
  async assetEXIF(
    uuid: string
  ): Promise<List<MetadataResult<ExifMetadataProperties>> | undefined> {
    const result = await this.fetchAssetEXIF(uuid);

    return result.node.exifMetadata;
  }

  /**
   * Recursively fetches child folders if they aren't present.
   * @param folder Folder to enrich with child folders.
   */
  async recursiveFolderEnrich(folder: Folder) {
    if (!folder.children) {
      folder.children = (await this.fetchFoldersByParent(folder.id)).node
        .children as Folder[];
    }

    for (let child of folder.children) {
      this.recursiveFolderEnrich(child);
    }
  }

  /**
   * Get all repositories from the GraphQL API.
   * @returns A list of repositories
   */
  async allRepositories(): Promise<Repository[]> {
    // TODO: handle more than 50 repos (???)
    return (await this.fetchRepositories()).viewer.mediaHubs.edges
      .map((edge) =>
        edge.node.assetRepositories.edges.map((repoEdge) => repoEdge.node)
      )
      .flat();
  }

  /**
   * Gets all repositories and their child folders.
   * @returns Enriched repositories
   */
  async allReposWithFolders(): Promise<EnrichedRepository[]> {
    const repos = (await this.allRepositories()) as EnrichedRepository[];

    for (let repo of repos) {
      repo.folders = await this.allFoldersByRepo(repo.id);

      for (let folder of repo.folders) {
        await this.recursiveFolderEnrich(folder);
      }
    }

    return repos;
  }

  /**
   * Converts a GraphQL edge list into a regular list.
   * @param value A GraphQL edge list containing the resources
   * @returns A list containing the resources
   */
  listToArray<T>(value?: List<T>): T[] {
    if (value == null) {
      return [];
    }

    return value.edges?.map((edge) => edge.node) ?? [];
  }

  /**
   * Converts GraphQL Assets with exif data into the interface friendly version.
   * @param assets The Assets from the GraphQL API
   * @returns A list of AssetsWithExif
   */
  toAssetWithExif(assets: AssetWithExifGql[]): AssetWithExif[] {
    return assets.map((gql) => ({
      ...gql,
      exifMetadata: this.listToArray(gql.exifMetadata)
    }));
  }

  /**
   * Gets Assets with Exif data from a given repo/folder.
   * @param repoId Repo to get assets from
   * @param folderId Folder to get assets from
   * @returns List of Assets with Exif data included
   */
  async getExifByFolder(
    repoId: string,
    folderId: string
  ): Promise<AssetWithExif[]> {
    let result: AssetWithExifGql[];

    if (
      folderId ===
      "QXNzZXRGb2xkZXI6MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAw"
    ) {
      // No folder - use repo.
      result = await this.paginate(async (after?: string) => {
        return (await this.fetchExifByRepo(repoId, after)).node?.assets;
      });
    } else {
      result = await this.paginate(async (after?: string) => {
        return (await this.fetchExifByFolder(folderId, after)).node?.assets;
      });
    }

    return this.toAssetWithExif(result);
  }

  /**
   * Extracts a Content Hub resource ID from a GraphQL global ID. Ignores the resource type.
   * @param encoded The encoded global ID
   * @returns The Content Hub ID
   */
  extractId(encoded: string): string {
    const decoded = atob(encoded);
    const colon = decoded.indexOf(":");

    if (colon > -1) {
      return decoded.substring(colon + 1);
    }

    return decoded;
  }

   /**
   * Gets Assets with Exif data from a given repo/folder, and a search query.
   * @param {Object} params Parameters to select assets with
   * @param params.repoId Repo to get assets from
   * @param params.folderId Folder to get assets from
   * @param params.query Query to filter assets with
   * @returns List of Assets with Exif data included
   */
  async queryAssetsExif({
    repoId,
    folderId,
    query,
  }: {
    repoId: string;
    folderId: string;
    query?: string;
  }): Promise<AssetWithExif[]> {
    const assetSearch = await this.paginate(async (after?: string) => {
      return (
        await this.fetchAssetsByFolder(
          this.extractId(repoId),
          this.extractId(folderId),
          query,
          after
        )
      ).assetSearch;
    });

    if (assetSearch == null || assetSearch.length === 0) {
      return [];
    }

    const exifs = await this.fetchAssetsEXIF(
      assetSearch.map((item) => item.id)
    );

    for (let i = 0; i < assetSearch.length; i++) {
      (assetSearch[i] as AssetWithExif).exifMetadata = this.listToArray(exifs[i].exifMetadata);
    }

    return assetSearch as AssetWithExif[];
  }

  /**
   * Gets the endpoint to use for accessing media.
   * @returns An endpoint name
   */
  async getEndpoint(): Promise<string> {
    // TODO
    return 'nmrsaalphatest';
  }
}
