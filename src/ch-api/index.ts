import { GraphQLClient } from "../graphql-client";
import { queryAssetByFolder, assetEXIF, repositories, foldersByRepo, foldersByParent, exifByRepo, exifByFolder } from "./queries";

interface Edge<T> {
  node: T;
  cursor?: string;
}

interface PageInfo {
  hasNextPage: boolean;
  endCursor: string;
}

export interface List<T> {
  edges: Edge<T>[];
}

interface Paginated<T> extends List<T> {
  total: number;
  pageInfo: PageInfo;
}

interface AssetSearchItem {
  id: string,
  name: string;
  label: string;
}

interface FetchAssetSearch {
  data: {
    assetSearch: Paginated<AssetSearchItem>
  }
}

interface MetadataProperties {
  id: string;
}

interface ExifMetadataProperties extends MetadataProperties {
  software: string;
  artist: string;
  description: string;
}

interface MetadataResult<T extends MetadataProperties> {
  schemaName: string;
  properties: T;
}

interface FetchExifMetadata {
  node: {
    id: string;
    exifMetadata?: List<MetadataResult<ExifMetadataProperties>>
  }
}

interface Repository {
  id: string;
  label: string;
}

interface FetchRepositories {
  viewer: {
    mediaHubs: List<{
      assetRepositories: Paginated<Repository>
    }>
  }
}

export interface Folder {
  id: string;
  label: string;
  children?: Folder[]
}

interface FetchFoldersByRepo {
  node: {
    id: string,
    assetFolders: Paginated<Folder>
  }
}

interface FetchFoldersByParent {
  node: Folder
}

export interface EnrichedRepository extends Repository {
  folders: Folder[]
}

export interface AssetWithExif extends AssetSearchItem {
  exifMetadata?: List<MetadataResult<ExifMetadataProperties>>
}

interface FetchExifByRepo {
  node: {
    id: string;
    assets: Paginated<AssetWithExif>;
  }
}

interface FetchExifByFolder {
  node: {
    id: string;
    assets: Paginated<AssetWithExif>;
  }
}

export function getFirstListItem<T>(list: List<T> | undefined): T | undefined {
  const edges = list?.edges;

  if (edges) {
    return edges[0]?.node;
  }

  return undefined;
}

export class ChApi extends GraphQLClient {
  async fetchAssetsByFolder(folderId: string, after?: string): Promise<FetchAssetSearch> {
    return await this.fetch(queryAssetByFolder, { folderId, after });
  }

  async fetchAssetEXIF(uuid: string): Promise<FetchExifMetadata> {
    return await this.fetch(assetEXIF, { uuid });
  }

  async fetchRepositories(after?: string): Promise<FetchRepositories> {
    return await this.fetch(repositories, { after });
  }

  async fetchFoldersByRepo(repoId: string, after?: string): Promise<FetchFoldersByRepo> {
    return await this.fetch(foldersByRepo, { repoId, after });
  }

  async fetchFoldersByParent(folderId: string): Promise<FetchFoldersByParent> {
    return await this.fetch(foldersByParent, { folderId });
  }

  async fetchExifByRepo(repoId: string, after?: string): Promise<FetchExifByRepo> {
    return await this.fetch(exifByRepo, { repoId, after });
  }

  async fetchExifByFolder(folderId: string, after?: string): Promise<FetchExifByFolder> {
    return await this.fetch(exifByFolder, { folderId, after });
  }

  // ---

  async paginate<T>(getItems: (after?: string) => Promise<Paginated<T>>): Promise<T[]> {
    const results: T[] = [];

    let lastPageInfo: PageInfo | undefined;
    do {
      const page = await getItems(lastPageInfo?.endCursor);

      results.push.apply(results, page.edges.map(edge => edge.node));

      lastPageInfo = page.pageInfo;
    } while (lastPageInfo.hasNextPage)

    return results;
  }

  async allAssetsByFolder(folderId: string): Promise<AssetSearchItem[]> {
    return await this.paginate(async (after?: string) => {
      return (await this.fetchAssetsByFolder(folderId, after)).data.assetSearch;
    });
  }

  async allFoldersByRepo(repoId: string): Promise<Folder[]> {
    return await this.paginate(async (after?: string) => {
      return (await this.fetchFoldersByRepo(repoId, after)).node.assetFolders;
    });
  }

  async assetEXIF(uuid: string): Promise<MetadataResult<ExifMetadataProperties> | undefined> {
    const result = await this.fetchAssetEXIF(uuid);

    return getFirstListItem(result.node.exifMetadata);
  }

  async recursiveFolderEnrich(folder: Folder) {
    if (!folder.children) {
      folder.children = (await this.fetchFoldersByParent(folder.id)).node.children as Folder[];
    }

    for (let child of folder.children) {
      this.recursiveFolderEnrich(child);
    }
  }

  async allRepositories(): Promise<Repository[]> {
    // TODO: handle more than 50 repos (???)
    return (await this.fetchRepositories()).viewer.mediaHubs.edges.map(edge => edge.node.assetRepositories.edges.map(repoEdge => repoEdge.node)).flat();
  }

  async allReposWithFolders(): Promise<EnrichedRepository[]> {
    const repos = await this.allRepositories() as EnrichedRepository[];

    for (let repo of repos) {
      repo.folders = await this.allFoldersByRepo(repo.id);

      for (let folder of repo.folders) {
        await this.recursiveFolderEnrich(folder);
      }
    }

    return repos;
  }

  async getExifByFolder(repoId: string, folderId: string): Promise<AssetWithExif[]> {
    let result: AssetWithExif[];

    if (folderId === "QXNzZXRGb2xkZXI6MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAw") {
      // No folder - use repo.
      result = await this.paginate(async (after?: string) => {
        return (await this.fetchExifByRepo(repoId, after)).node.assets;
      });
    } else {
      result = await this.paginate(async (after?: string) => {
        return (await this.fetchExifByFolder(folderId, after)).node.assets;
      });
    }

    return result;
  }
}
