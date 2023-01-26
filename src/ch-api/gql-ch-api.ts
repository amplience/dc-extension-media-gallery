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
 * TODO: javadoc
 */
interface Edge<T> {
  node: T;
  cursor?: string;
}

/**
 * 
 */
interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

/**
 * 
 */
interface List<T> {
  edges: Edge<T>[];
}

/**
 * 
 */
interface Paginated<T> extends List<T> {
  total: number;
  pageInfo: PageInfo;
}

/**
 * 
 */
interface FetchAssetSearch {
  assetSearch: Paginated<AssetSearchItem>;
}

/**
 * 
 */
interface FetchExifMetadataAsset {
  id: string;
  exifMetadata?: List<MetadataResult<ExifMetadataProperties>>;
}

/**
 * 
 */
interface FetchExifMetadata {
  node: FetchExifMetadataAsset;
}

/**
 * 
 */
interface FetchRepositories {
  viewer: {
    mediaHubs: List<{
      assetRepositories: Paginated<Repository>;
    }>;
  };
}

/**
 * 
 */
interface FetchFoldersByRepo {
  node: {
    id: string;
    assetFolders: Paginated<Folder>;
  };
}

/**
 * 
 */
interface FetchFoldersByParent {
  node: Folder;
}

/**
 * 
 */
interface AssetWithExifGql extends AssetSearchItem {
  exifMetadata?: List<MetadataResult<ExifMetadataProperties>>;
}

/**
 * 
 */
interface FetchExifByRepo {
  node: {
    id: string;
    assets: Paginated<AssetWithExifGql>;
  };
}

/**
 * 
 */
interface FetchExifByFolder {
  node: {
    id: string;
    assets: Paginated<AssetWithExifGql>;
  };
}

/**
 * 
 * @param list 
 * @returns 
 */
export function getFirstListItem<T>(list: List<T> | undefined): T | undefined {
  const edges = list?.edges;

  if (edges) {
    return edges[0]?.node;
  }

  return undefined;
}

/**
 * 
 */
export class GqlChApi extends GraphQLClient implements IChApi {
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
   * 
   * @param uuid 
   * @returns 
   */
  async fetchAssetEXIF(uuid: string): Promise<FetchExifMetadata> {
    return await this.fetch(assetEXIF, { uuid });
  }

  /**
   * 
   * @param uuids 
   * @returns 
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
   * 
   * @param after 
   * @returns 
   */
  async fetchRepositories(after?: string): Promise<FetchRepositories> {
    return await this.fetch(repositories, { after });
  }

  /**
   * 
   * @param repoId 
   * @param after 
   * @returns 
   */
  async fetchFoldersByRepo(
    repoId: string,
    after?: string
  ): Promise<FetchFoldersByRepo> {
    return await this.fetch(foldersByRepo, { repoId, after });
  }

  /**
   * 
   * @param folderId 
   * @returns 
   */
  async fetchFoldersByParent(folderId: string): Promise<FetchFoldersByParent> {
    return await this.fetch(foldersByParent, { folderId });
  }

  /**
   * 
   * @param repoId 
   * @param after 
   * @returns 
   */
  async fetchExifByRepo(
    repoId: string,
    after?: string
  ): Promise<FetchExifByRepo> {
    return await this.fetch(exifByRepo, { repoId, after });
  }

  /**
   * 
   * @param folderId 
   * @param after 
   * @returns 
   */
  async fetchExifByFolder(
    folderId: string,
    after?: string
  ): Promise<FetchExifByFolder> {
    return await this.fetch(exifByFolder, { folderId, after });
  }

  // ---

  /**
   * 
   * @param getItems 
   * @returns 
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
   * 
   * @param repoId 
   * @returns 
   */
  async allFoldersByRepo(repoId: string): Promise<Folder[]> {
    return await this.paginate(async (after?: string) => {
      return (await this.fetchFoldersByRepo(repoId, after)).node?.assetFolders;
    });
  }

  /**
   * 
   * @param uuid 
   * @returns 
   */
  async assetEXIF(
    uuid: string
  ): Promise<List<MetadataResult<ExifMetadataProperties>> | undefined> {
    const result = await this.fetchAssetEXIF(uuid);

    return result.node.exifMetadata;
  }

  /**
   * 
   * @param folder 
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
   * 
   * @returns 
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
   * 
   * @returns 
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
   * 
   * @param value 
   * @returns 
   */
  listToArray<T>(value?: List<T>): T[] {
    if (value == null) {
      return [];
    }

    return value.edges?.map((edge) => edge.node) ?? [];
  }

  /**
   * 
   * @param assets 
   * @returns 
   */
  toAssetWithExif(assets: AssetWithExifGql[]): AssetWithExif[] {
    return assets.map((gql) => ({
      ...gql,
      exifMetadata: this.listToArray(gql.exifMetadata)
    }));
  }

  /**
   * 
   * @param repoId 
   * @param folderId 
   * @returns 
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
   * 
   * @param encoded 
   * @returns 
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
   * 
   * @param param0 
   * @returns 
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
   * 
   * @returns 
   */
  async getEndpoint(): Promise<string> {
    // TODO
    return 'nmrsaalphatest';
  }
}
