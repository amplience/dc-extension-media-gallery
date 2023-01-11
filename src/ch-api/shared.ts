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
