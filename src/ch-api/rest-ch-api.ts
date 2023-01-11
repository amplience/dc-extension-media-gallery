import { EnrichedRepository, AssetWithExif, ExifMetadataProperties, MetadataResult, Folder } from "./shared";
import { AuthClient } from "../auth-client";
import IChApi from "./i-ch-api";

interface List<T> {
  data: T[];
  count: number;
}

interface Paginated<T> extends List<T> {
  numFound: number;
  start: number;
  pageSize: number;
}

interface Result<T> {
  status: string;
  content: T;
}

interface FolderBase {
  children: RestFolder[];
  numFound: number;
  id: string;
  label: string;
  type: "folder" | "bucket";
  numItems: string;
}

interface RestFolder extends FolderBase {
  bucketId: string;
  status: string;
  type: "folder";
}

interface Repository extends FolderBase {
  imageClassificationEnabled: boolean;
  shared: boolean;
  isDefault: boolean;
  type: "bucket";
}

type GetFoldersResult = Result<List<Repository>>;

type ExifRelationship = {
  schema: 'exif',
  variants: [
    {
      values: ExifMetadataProperties
    }
  ]
}[];

interface Asset {
  id: string,
  name: string;
  label: string;
  timestamp: string;
  relationships: {
    containsEXIF?: ExifRelationship
  }
}

export class RestChApi extends AuthClient implements IChApi {
  apiUrl = "http://dam-api-internal.amplience.net/v1.5.0/";

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

  toEnrichedFolder(folders: RestFolder[]): Folder[] {
    return folders.map((rest) => ({
      id: rest.id,
      label: rest.label,
      children: this.toEnrichedFolder(rest.children),
    }));
  }

  toEnrichedRepository(repos: Repository[]): EnrichedRepository[] {
    return repos.map((rest) => ({
      id: rest.id,
      label: rest.label,
      folders: this.toEnrichedFolder(rest.children),
    }));
  }

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

  toAssetWithExif(assets: Asset[]): AssetWithExif[] {
    return assets.map((rest) => (
      {
        id: rest.id,
        label: rest.label,
        name: rest.name,
        updatedDate: rest.timestamp,
        exifMetadata: this.toMetadata(rest.relationships.containsEXIF)
      }
    ))
  }

  async allReposWithFolders(): Promise<EnrichedRepository[]> {
    const result = (await this.fetchUrl(
      "folders",
      "GET",
      undefined,
      {}
    )) as GetFoldersResult;

    return this.toEnrichedRepository(result.content.data);
  }

  async getExifByFolder(
    repoId: string,
    folderId: string
  ): Promise<AssetWithExif[]> {
    const q =
      folderId !== "00000000-0000-0000-0000-000000000000"
        ? `folder:${folderId}`
        : `folder:${repoId}`;

    return this.toAssetWithExif(
      await this.paginate<Asset>("assets", "GET", undefined, {
        q,
        select: "meta:exif",
      })
    );
  }

  async queryAssetsExif({
    repoId,
    folderId,
    query,
  }: {
    repoId: string;
    folderId: string;
    query?: string | undefined;
  }): Promise<AssetWithExif[]> {
    let q =
      folderId !== "00000000-0000-0000-0000-000000000000"
        ? `folder:${folderId}`
        : `folder:${repoId}`;

    q = `(${query}) AND (${q})`;

    return this.toAssetWithExif(
      await this.paginate<Asset>("assets", "GET", undefined, {
        q,
        select: "meta:exif",
      })
    );
  }
}
