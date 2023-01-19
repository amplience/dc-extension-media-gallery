import { MetadataMap } from "../model/metadata-map"

export default interface Params {
    clientId: string,
    clientSecret: string,
    configPath: string,
    galleryPath: string,
    metadataMap: MetadataMap
}