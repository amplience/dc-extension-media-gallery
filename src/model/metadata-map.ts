/**
 * Flags for metadata field visibility in various UI views.
 */
export type VisibilityFlags = 'edit' | 'import' | 'grid' | 'list' | 'info';

/**
 * Metadata definition mapping, containing source and target properties 
 * for importing metadata and how it is displayed/edited on the UI.
 */
export interface MetadataMapEntry {
    source: string,
    target: string,
    label: string,
    editable: boolean,
    sortable: boolean,
    type: 'string' | 'number' | 'multiline' | 'date',
    icon: string,
    visibility: VisibilityFlags[]
}

/**
 * Convert a metadata value into a string.
 * @param meta The metadata definition
 * @param value The metadata value
 * @returns A string version of the metadata value.
 */
export const metaToString = (meta: MetadataMapEntry, value: any) => {
    switch (meta.type) {
        case 'date':
            if (value == null) {
                return 'Unspecified';
            }

            return new Date(value * 1000).toDateString();
        default:
            return value;
    }
}

/**
 * List of metadata definition mappings.
 */
export type MetadataMap = MetadataMapEntry[];