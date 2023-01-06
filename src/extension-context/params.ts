export default interface Params {
    clientId: string,
    clientSecret: string,
    configPath: string,
    galleryPath: string,
    exifMap: { [key: string]: string }
}