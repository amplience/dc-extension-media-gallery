export type VisibilityFlags = 'edit' | 'import' | 'grid' | 'list' | 'info';

export interface MetadataMapEntry {
    source: string,
    target: string,
    label: string,
    editable: boolean,
    sortable: boolean,
    type: 'string' | 'number' | 'multiline',
    icon: string,
    visibility: VisibilityFlags[]
}

export type MetadataMap = MetadataMapEntry[];