import Entry from "./entry";
import { AssetWithExif } from "../ch-api/shared";
import { MetadataMap } from "./metadata-map";
import { MediaItem } from ".";
import Params from "../extension-context/params";

/**
 * Default metadata map if not provided in the extension params.
 */
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

/**
 * Default values for specific exif sources if they are not present.
 */
const defaultExifValues: any = {
};

/**
 * Gets the first item of a list if present, or undefined.
 * @param items List of items
 * @returns The first item, or undefined
 */
function first<T>(items: T[] | undefined): T | undefined {
  if (items) {
    return items[0];
  }

  return undefined;
}

/**
 * Convert an asset from the API into a media entry.
 * @param asset Asset from the API
 * @param metadataMap Mapping for copying metadata
 * @param chConfiguration Content Hub configuration, specifically defaultHost and endpoint
 * @returns Return a media entry
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
 * Gets an image url for a given media entry.
 * @param asset Media entry
 * @param vse VSE URL to use instead of defaultHost.
 * @returns Image URL for the media entry
 */
export function assetToImg(asset: Entry, vse?: string): string {
  return `https://${vse ?? asset.photo.defaultHost}/i/${asset.photo.endpoint}/${
    asset.photo.name
  }`;
}

/**
 * Converts media items into media entries that can be saved to the content item.
 * @param items List of media items
 * @returns List of media entries
 */
export function itemsToAssets(items: MediaItem[]): Entry[] {
  return items.map((item) => item.entry as Entry);
}

/**
 * Converts media entries into media items for use in the UI.
 * @param assets List of media entries
 * @param params Extension parameters
 * @returns List of media items
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
