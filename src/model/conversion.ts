import Entry from "./entry";
import {AssetWithExif, getFirstListItem} from '../ch-api';
import ExifMap from "./exif-map";

export const defaultExifMap: ExifMap = {
    photographer: 'artist',
    description: 'description'
}

export function convertToEntry(asset: AssetWithExif, exifMap: ExifMap, chConfiguration: any): Entry {
    const metadata = getFirstListItem(asset.exifMetadata)?.properties as any;

    const idString = atob(asset.id);

    const result = {
        _meta: {
            schema: 'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link'
        },
        id: idString.split(':')[1],
        name: asset.name,
        photographer: 'Unknown',
        description: 'No description.',
        ...chConfiguration
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