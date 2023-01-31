/**
 * Content Hub Asset base properties
 */
export interface AssetSearchItem {
  id: string,
  name: string;
  label: string;
  updatedDate: string;
}

/**
 * Content Hub Repository
 */
export interface Repository {
  id: string;
  label: string;
}

/**
 * Content Hub Metadata base properties
 */
export interface MetadataProperties {
  id: string;
}

/**
 * Content Hub Exif Metadata
 */
export interface ExifMetadataProperties extends MetadataProperties {
  software: string;
  artist: string;
  description: string;
}

/**
 * Content Hub Metadata Eesult
 */
export interface MetadataResult<T extends MetadataProperties> {
  schemaName: string;
  properties: T;
}

/**
 * Content Hub Folder
 */
export interface Folder {
  id: string;
  label: string;
  children?: Folder[];
}

/**
 * Content Hub Repository enriched with child folders
 */
export interface EnrichedRepository extends Repository {
  folders: Folder[];
}

/**
 * Asset enriched with exif metadata
 */
export interface AssetWithExif extends AssetSearchItem {
  exifMetadata?: MetadataResult<ExifMetadataProperties>[];
}

/**
 * Determine if a folder ID is equivalent to 'No Folder'.
 * @param id The folder ID to check
 * @returns True if the ID represents No Folder, false otherwise
 */
const idIsNone = (id: string) => {
  return id === '00000000-0000-0000-0000-000000000000' || id === 'QXNzZXRGb2xkZXI6MDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAw';
}

/**
 * Sort folders in ascending alphanumeric order recursively.
 * @param folders Folders to sort in place
 */
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

/**
 * Sort repositories and any contained folders in ascending alphanumeric order.
 * @param repos Repositories to sort in place
 */
export const sortRepos = (repos: EnrichedRepository[]) => {
  for (let repo of repos) {
    if (repo.folders) {
      sortFolders(repo.folders);
    }
  }

  repos.sort((a, b) => a.label > b.label ? 1 : b.label > a.label ? -1 : 0)
}