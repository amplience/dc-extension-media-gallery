import { AssetWithExif, EnrichedRepository } from "./shared";

interface IChApi {
  auth(id: string, secret: string): Promise<void>;

  allReposWithFolders(): Promise<EnrichedRepository[]>;
  getExifByFolder(repoId: string, folderId: string): Promise<AssetWithExif[]>;
  queryAssetsExif({repoId, folderId, query}: {repoId: string, folderId: string, query?: string}): Promise<AssetWithExif[]>;
}

export default IChApi;