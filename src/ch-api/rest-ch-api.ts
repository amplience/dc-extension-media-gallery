import { EnrichedRepository, AssetWithExif, ExifMetadataProperties, MetadataResult, Folder } from "./shared";
import { AuthClient } from "../auth-client";
import IChApi from "./i-ch-api";

/**
 * Content Hub REST list container
 */
interface List<T> {
  data: T[];
  count: number;
}

/**
 * Content Hub REST pagination container
 */
interface Paginated<T> extends List<T> {
  numFound: number;
  start: number;
  pageSize: number;
}

/**
 * Content Hub REST response container
 */
interface Result<T> {
  status: string;
  content: T;
}

/**
 * Content Hub shared properties between Folders and Repositories
 */
interface FolderBase {
  children: RestFolder[];
  numFound: number;
  id: string;
  label: string;
  type: "folder" | "bucket";
  numItems: string;
}

/**
 * Content Hub REST Folder
 */
interface RestFolder extends FolderBase {
  bucketId: string;
  status: string;
  type: "folder";
}

/**
 * Content Hub REST Repository
 */
interface Repository extends FolderBase {
  imageClassificationEnabled: boolean;
  shared: boolean;
  isDefault: boolean;
  type: "bucket";
}

/**
 * Content Hub REST folders/ response.
 */
type GetFoldersResult = Result<List<Repository>>;

/**
 * Content Hub REST Exif Relationship.
 */
type ExifRelationship = {
  schema: 'exif',
  variants: [
    {
      values: ExifMetadataProperties
    }
  ]
}[];

/**
 * Content Hub REST Asset.
 */
interface Asset {
  id: string,
  name: string;
  label: string;
  timestamp: string;
  relationships: {
    containsEXIF?: ExifRelationship
  }
}

/**
 * Content Hub REST Settings.
 */
interface Settings {
  di: {
    endpoints: {
      path: string,
      dynamicHost: string
    }[]
  }
}

/**
 * A Content Hub API Client that uses the REST API.
 */
export class RestChApi extends AuthClient implements IChApi {
  apiUrl = "http://dam-api-internal.amplience.net/v1.5.0/";

  /**
   * Requests all content from paginated endpoint.
   * @param url The base URL to request
   * @param method The HTTP method for the requests
   * @param body The body to send with the requests
   * @param query The query parameters to use
   * @returns A list of the requested asset type
   */
  async paginate<T>(
    url: string,
    method: "GET" | "POST",
    body?: any,
    query?: any
  ): Promise<T[]> {
    const results: T[] = [];

    let position = 0;
    let continueLoop = true;
    do {
      const response = (await this.fetchUrl(url, method, body, {
        ...query,
        s: position,
      })) as Result<Paginated<T>>;

      if (!response?.content?.data) {
        return results;
      }

      results.push.apply(results, response.content.data);

      position += response.content.pageSize;
      continueLoop = position < response.content.numFound;
    } while (continueLoop);

    return results;
  }

  /**
   * Converts folders from the REST API to EnrichedFolders.
   * @param folders Folders from the REST API
   * @returns Converted EnrichedFolder list
   */
  toEnrichedFolder(folders: RestFolder[]): Folder[] {
    return folders.map((rest) => ({
      id: rest.id,
      label: rest.label,
      children: this.toEnrichedFolder(rest.children),
    }));
  }

  /**
   * Converts repositories from the REST API to EnrichedRepository.
   * @param repos Repositories from the REST API
   * @returns Converted EnrichedRepository list
   */
  toEnrichedRepository(repos: Repository[]): EnrichedRepository[] {
    return repos.map((rest) => ({
      id: rest.id,
      label: rest.label,
      folders: this.toEnrichedFolder(rest.children),
    }));
  }

  /**
   * Converts relationships from the REST API to a MetadataResult.
   * @param relationships Relationships from the REST API
   * @returns Converted metadata
   */
  toMetadata(relationships: ExifRelationship | undefined): MetadataResult<ExifMetadataProperties>[] {
    if (!relationships || relationships.length === 0) {
      return [];
    }

    const data: MetadataResult<ExifMetadataProperties>[] = [];

    for (let rel of relationships) {
      for (let variant of rel.variants) {
        data.push({
          schemaName: rel.schema,
          properties: variant.values
        });
      }
    }

    return data;
  }

  /**
   * Converts Assets from the REST API to AssetWithExif
   * @param assets Assets from the REST API
   * @returns Converted AssetWithExif list
   */
  toAssetWithExif(assets: Asset[]): AssetWithExif[] {
    return assets.map((rest) => (
      {
        id: rest.id,
        label: rest.label,
        name: rest.name,
        updatedDate: new Date(rest.timestamp).toISOString(),
        exifMetadata: this.toMetadata(rest.relationships.containsEXIF)
      }
    ))
  }

  /**
   * Gets all repositories and their child folders from the REST API.
   * @returns Enriched repositories
   */
  async allReposWithFolders(): Promise<EnrichedRepository[]> {
    const result = (await this.fetchUrl(
      "folders",
      "GET",
      undefined,
      {}
    )) as GetFoldersResult;

    return this.toEnrichedRepository(result.content.data);
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
    let q: string | undefined;

    if (folderId !== 'root') {
      q = `folder:${folderId} AND type:image`;
    } else {
      q = `type:image`;
    }

    return this.toAssetWithExif(
      await this.paginate<Asset>("assets", "GET", undefined, {
        q,
        bucket: repoId,
        select: "meta:exif",
        n: 100
      })
    );
  }

   /**
   * Gets Assets with Exif data from a given repo/folder, and a search query.
   * @param repoId Repo to get assets from
   * @param folderId Folder to get assets from
   * @param query Query to filter assets with
   * @returns List of Assets with Exif data included
   */
  async queryAssetsExif({
    repoId,
    folderId,
    query,
  }: {
    repoId: string;
    folderId: string;
    query?: string | undefined;
  }): Promise<AssetWithExif[]> {
    let q: string | undefined;

    if (folderId !== 'root') {
      q = `(${query}) AND (folder:${folderId} AND type:image)`;
    } else {
      q = `(${query}) AND type:image`;
    }

    return this.toAssetWithExif(
      await this.paginate<Asset>("assets", "GET", undefined, {
        q,
        bucket: repoId,
        select: "meta:exif",
        n: 100
      })
    );
  }

  /**
   * Gets the endpoint to use for accessing media.
   * @returns An endpoint name
   */
  async getEndpoint(): Promise<string> {
    const response = (await this.fetchUrl('settings', 'GET', undefined)) as Result<Settings>;

    return response.content.di.endpoints[0].path;
  }
}
