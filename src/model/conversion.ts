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
  description: 'No Description.'
};

function first<T>(items: T[] | undefined): T | undefined {
  if (items) {
    return items[0];
  }

  return undefined;
}

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

export function assetToImg(asset: Entry): string {
  // TODO: pass vse as argument
  const vse = "1v8j1gmgsolq81dxx8zx7pdehf.staging.bigcontent.io";

  return `https://${vse ?? asset.photo.defaultHost}/i/${asset.photo.endpoint}/${
    asset.photo.name
  }`;
}

export function itemsToAssets(items: MediaItem[]): Entry[] {
  return items.map((item) => item.entry as Entry);
}

export function assetsToItems(assets: Entry[], params: Params): MediaItem[] {
  return assets.map((asset, index) => ({
    id: asset.photo.id,
    selected: false,
    disabled: false,
    updated: false,
    dateModified: asset.date,
    img: assetToImg(asset),
    entry: asset,
  }));
}
