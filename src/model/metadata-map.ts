/**
 * TODO: javadoc
 */
export type VisibilityFlags = 'edit' | 'import' | 'grid' | 'list' | 'info';

/**
 * 
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
 * 
 * @param meta 
 * @param value 
 * @returns 
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
 * 
 */
export type MetadataMap = MetadataMapEntry[];