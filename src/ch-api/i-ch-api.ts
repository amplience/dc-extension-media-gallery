import { AssetWithExif, EnrichedRepository } from "./shared";

/**
 * An interface for a Content Hub API Client.
 */
interface IChApi {
  /**
   * Authenticate the OAuth client using an ID and secret.
   * @param id Client ID
   * @param secret Client Secret
   */
  auth(id: string, secret: string): Promise<void>;

  /**
   * Gets all repositories and their child folders.
   * @returns Enriched repositories
   */
  allReposWithFolders(): Promise<EnrichedRepository[]>;

  /**
   * Gets Assets with Exif data from a given repo/folder.
   * @param repoId Repo to get assets from
   * @param folderId Folder to get assets from
   * @returns List of Assets with Exif data included
   */
  getExifByFolder(repoId: string, folderId: string): Promise<AssetWithExif[]>;

  /**
   * Gets Assets with Exif data from a given repo/folder, and a search query.
   * @param {Object} params Parameters to select assets with
   * @param params.repoId Repo to get assets from
   * @param params.folderId Folder to get assets from
   * @param params.query Query to filter assets with
   * @returns List of Assets with Exif data included
   */
  queryAssetsExif({repoId, folderId, query}: {repoId: string, folderId: string, query?: string}): Promise<AssetWithExif[]>;

  /**
   * Gets the endpoint to use for accessing media.
   * @returns An endpoint name
   */
  getEndpoint(): Promise<string>;
}

export default IChApi;