export interface AssetSearchItem {
  id: string,
  name: string;
  label: string;
  updatedDate: string;
}

export interface Repository {
  id: string;
  label: string;
}

export interface MetadataProperties {
  id: string;
}

export interface ExifMetadataProperties extends MetadataProperties {
  software: string;
  artist: string;
  description: string;
}

export interface MetadataResult<T extends MetadataProperties> {
  schemaName: string;
  properties: T;
}

export interface Folder {
  id: string;
  label: string;
  children?: Folder[];
}

export interface EnrichedRepository extends Repository {
  folders: Folder[];
}

export interface AssetWithExif extends AssetSearchItem {
  exifMetadata?: MetadataResult<ExifMetadataProperties>[];
}

const idIsNone = (id: string) => {
  return id === '00000000-0000-0000-0000-000000000000' || id === 'QXNzZXRGb2xkZXI6MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAw';
}

const sortFolders = (folders: Folder[]) => {
  for (let folder of folders) {
    if (folder.children) {
      sortFolders(folder.children);
    }
  }

  folders.sort((a, b) => {
    // No Folder always appears last
    const aLabel = idIsNone(a.id) ? '~~~' : a.label;
    const bLabel = idIsNone(b.id) ? '~~~' : b.label;

    return aLabel > bLabel ? 1 : bLabel > aLabel ? -1 : 0
  })
}

export const sortRepos = (repos: EnrichedRepository[]) => {
  for (let repo of repos) {
    if (repo.folders) {
      sortFolders(repo.folders);
    }
  }

  repos.sort((a, b) => a.label > b.label ? 1 : b.label > a.label ? -1 : 0)
}