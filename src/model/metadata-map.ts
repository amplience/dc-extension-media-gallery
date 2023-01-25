export type VisibilityFlags = 'edit' | 'import' | 'grid' | 'list' | 'info';

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

export const metaToString = (meta: MetadataMapEntry, value: any) => {
    switch (meta.type) {
        case 'date':
            return new Date(value).toDateString();
        default:
            return value;
    }
}

export type MetadataMap = MetadataMapEntry[];