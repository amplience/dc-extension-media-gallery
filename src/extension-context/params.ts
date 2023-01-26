import { MetadataMap } from "../model/metadata-map"

/**
 * TODO: javadoc
 */
export default interface Params {
    clientId: string,
    clientSecret: string,
    configPath: string,
    galleryPath: string,
    metadataMap: MetadataMap,
    vse?: string
}