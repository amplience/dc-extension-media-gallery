import Entry from "./entry";
import { AssetWithExif } from "../ch-api/shared";
import ExifMap from "./exif-map";
import { MediaItem } from ".";

export const defaultExifMap: ExifMap = {
  photographer: "artist",
  description: "description",
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

  const result = {
    photo: {
      _meta: {
        schema:
          "http://bigcontent.io/cms/schema/v1/core#/definitions/image-link",
      },
      id: idString,
      name: asset.name,
      ...chConfiguration,
    },
    photographer: "Unknown",
    description: "No description.",
    date: asset.updatedDate
  };

  if (metadata) {
    if (exifMap.photographer && metadata[exifMap.photographer]) {
      result.photographer = metadata[exifMap.photographer];
    }

    if (exifMap.description && metadata[exifMap.description]) {
      result.description = metadata[exifMap.description];
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

export function assetsToItems(assets: Entry[]): MediaItem[] {
  return assets.map((asset, index) => ({
    id: index + 1,
    selected: false,
    dateModified: "",
    img: assetToImg(asset),
    title: asset.description,
    author: asset.photographer,
    entry: asset,
  }));
}
