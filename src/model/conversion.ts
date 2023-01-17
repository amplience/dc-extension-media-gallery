import Entry from "./entry";
import { AssetWithExif } from "../ch-api/shared";
import ExifMap from "./exif-map";
import { MediaItem } from ".";
import Params from "../extension-context/params";

export const defaultExifMap: ExifMap = {
  photographer: "artist",
  description: "description",
};

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
  exifMap: ExifMap,
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

  for (let key of Object.keys(exifMap)) {
    if (metadata && metadata[exifMap[key]]) {
      result[key] = metadata[exifMap[key]];
    } else {
      result[key] = defaultExifValues[exifMap[key]];
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
    id: index + 1,
    selected: false,
    disabled: false,
    dateModified: "",
    img: assetToImg(asset),
    title: asset[params.displayDescription],
    author: asset[params.displayAuthor],
    entry: asset,
  }));
}
