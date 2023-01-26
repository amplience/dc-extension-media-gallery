import Entry from "./entry";
import { AssetWithExif } from "../ch-api/shared";
import { MetadataMap } from "./metadata-map";
import { MediaItem } from ".";
import Params from "../extension-context/params";

export const defaultMetadataMap: MetadataMap = [
  {
    source: 'exif/artist',
    target: 'photographer',
    label: 'Artist',
    editable: true,
    sortable: true,
    type: 'string',
    icon: 'author',
    visibility: [
      'edit', 'import', 'grid', 'list', 'info'
    ]
  },
  {
    source: 'exif/description',
    target: 'description',
    label: 'Description',
    editable: true,
    sortable: true,
    type: 'multiline',
    icon: 'text',
    visibility: [
      'edit', 'import', 'grid', 'list', 'info'
    ]
  }
]

const defaultExifValues: any = {
  artist: 'Unknown',
  description: 'None'
};

/**
 * TODO: javadoc
 * @param items 
 * @returns 
 */
function first<T>(items: T[] | undefined): T | undefined {
  if (items) {
    return items[0];
  }

  return undefined;
}

/**
 * 
 * @param asset 
 * @param metadataMap 
 * @param chConfiguration 
 * @returns 
 */
export function convertToEntry(
  asset: AssetWithExif,
  metadataMap: MetadataMap,
  chConfiguration: any
): Entry {
  const metadata = first(asset.exifMetadata)?.properties as any;

  const idString = asset.id.length === 36 ? asset.id : (atob(asset.id).split(":")[1]);

  const result : Entry = {
    photo: {
      _meta: {
        schema:
          "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link",
      },
      id: idString,
      name: asset.name,
      ...chConfiguration,
    },
    date: asset.updatedDate
  };

  for (let meta of metadataMap) {
    let source = meta.source;

    // TODO: support more than exif?
    if (source.startsWith('exif/')) {
      source = source.substring(5);
    }

    if (metadata && metadata[source]) {
      result[meta.target] = metadata[source];
    } else {
      result[meta.target] = defaultExifValues[source];
    }
  }

  return result;
}

/**
 * 
 * @param asset 
 * @param vse 
 * @returns 
 */
export function assetToImg(asset: Entry, vse?: string): string {
  return `https://${vse ?? asset.photo.defaultHost}/i/${asset.photo.endpoint}/${
    asset.photo.name
  }`;
}

/**
 * 
 * @param items 
 * @returns 
 */
export function itemsToAssets(items: MediaItem[]): Entry[] {
  return items.map((item) => item.entry as Entry);
}

/**
 * 
 * @param assets 
 * @param params 
 * @returns 
 */
export function assetsToItems(assets: Entry[], params: Params): MediaItem[] {
  return assets.map((asset, index) => ({
    id: asset.photo.id,
    selected: false,
    disabled: false,
    updated: false,
    outOfSync: false,
    dateModified: asset.date,
    img: assetToImg(asset, params.vse),
    entry: asset,
  }));
}
