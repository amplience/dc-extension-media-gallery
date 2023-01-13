import ExifMap from "../model/exif-map"

export default interface Params {
    clientId: string,
    clientSecret: string,
    configPath: string,
    galleryPath: string,
    exifMap: ExifMap,
    displayDescription: string,
    displayAuthor: string
}