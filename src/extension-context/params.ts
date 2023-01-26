import { MetadataMap } from "../model/metadata-map"

/**
 * Extension parameters
 */
export default interface Params {
    clientId: string,
    clientSecret: string,
    configPath: string,
    galleryPath: string,
    metadataMap: MetadataMap,
    vse?: string
}