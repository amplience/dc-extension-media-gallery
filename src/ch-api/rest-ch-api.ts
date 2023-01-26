import { EnrichedRepository, AssetWithExif, ExifMetadataProperties, MetadataResult, Folder } from "./shared";
import { AuthClient } from "../auth-client";
import IChApi from "./i-ch-api";

/**
 * TODO: javadoc
 */
interface List<T> {
  data: T[];
  count: number;
}

/**
 * 
 */
interface Paginated<T> extends List<T> {
  numFound: number;
  start: number;
  pageSize: number;
}

/**
 * 
 */
interface Result<T> {
  status: string;
  content: T;
}

/**
 * 
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
 * 
 */
interface RestFolder extends FolderBase {
  bucketId: string;
  status: string;
  type: "folder";
}

/**
 * 
 */
interface Repository extends FolderBase {
  imageClassificationEnabled: boolean;
  shared: boolean;
  isDefault: boolean;
  type: "bucket";
}

/**
 * 
 */
type GetFoldersResult = Result<List<Repository>>;

/**
 * 
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
 * 
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
 * 
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
 * 
 */
export class RestChApi extends AuthClient implements IChApi {
  apiUrl = "http://dam-api-internal.amplience.net/v1.5.0/";

  /**
   * 
   * @param url 
   * @param method 
   * @param body 
   * @param query 
   * @returns 
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
   * 
   * @param folders 
   * @returns 
   */
  toEnrichedFolder(folders: RestFolder[]): Folder[] {
    return folders.map((rest) => ({
      id: rest.id,
      label: rest.label,
      children: this.toEnrichedFolder(rest.children),
    }));
  }

  /**
   * 
   * @param repos 
   * @returns 
   */
  toEnrichedRepository(repos: Repository[]): EnrichedRepository[] {
    return repos.map((rest) => ({
      id: rest.id,
      label: rest.label,
      folders: this.toEnrichedFolder(rest.children),
    }));
  }

  /**
   * 
   * @param relationships 
   * @returns 
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
   * 
   * @param assets 
   * @returns 
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
   * 
   * @returns 
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
   * 
   * @param repoId 
   * @param folderId 
   * @returns 
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
   * 
   * @returns 
   */
  async getEndpoint(): Promise<string> {
    const response = (await this.fetchUrl('settings', 'GET', undefined)) as Result<Settings>;

    return response.content.di.endpoints[0].path;
  }
}
