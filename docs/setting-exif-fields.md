# Setting EXIF fields

You can control the metadata that is saved in the content, and displayed in the different views of the extension. This can be done by editing the extension's installation parameters. 

Here is a sample configuration with `photographer` and `caption` metadata, both sourced from `artist` and `description` in the exif metadata respectively:

```json
{
  "clientId": "xxxx",
  "clientSecret": "yyyy",
  "configPath": "galleryConfig",
  "galleryPath": "photoGallery",
  "metadataMap": [
    {
      "source": "exif/artist",
      "target": "photographer",
      "label": "Photographer",
      "editable": true,
      "sortable": true,
      "type": "string",
      "icon": "author",
      "visibility": [
        "edit",
        "import",
        "grid",
        "list",
        "info"
      ]
    },
    {
      "source": "exif/description",
      "target": "description",
      "label": "Caption",
      "editable": true,
      "sortable": true,
      "type": "multiline",
      "icon": "text",
      "visibility": [
        "edit",
        "import",
        "grid",
        "list",
        "info"
      ]
    }
  ]
}
```

Metadata configuration properties:

| property | description |
|----------|-------------|
| `source` | Source field in the image metadata to copy to the content item. For now, the source can only be an EXIF field, prefixed with `exif/` |
| `target` | The target field for the additional metadata. This needs to appear in your Media Gallery schema. |
| `label` | The label to use when displaying this metadata in the extension. |
| `type` | The type of editor used for this metadata. Can be `string`, `number`, `multiline` or `date` (timestamp in milliseconds) |
| `editable` | Specifies if the field is read-only or editable in the details drawer. |
| `sortable` | Specifies if the field appears in the sort menu. |
| `icon` | An icon to display alongside the content editor. Options are `author` or `text`. |
| `visibility` | Controls the visibility of the field in the different views - `grid`, `list`, `info`, `edit`, `import` (see below) |

Field visibility:

| keyword | View |
|---------|------|
| `grid` | The field will appear in the grid view as additional lines |
| `list` | The field will appear in the list view as additional columns |
| `info` | The field will appear in the info panel in fullscreen view as additional rows |
| `edit` | The field will appear in the edit drawer as additional read-only or editable fields |
| `import` | The field will appear in the import grid view as additional lines |

Additional metadata in `grid` view:

![Metadata in grid view](../media/metadata-grid-view.png)

Additional metadata in `list` view:

![Metadata in list view](../media/metadata-list-view.png)

Additional metadata in `info` view:

![Metadata in info view](../media/metadata-info-view.png)

Additional metadata in `edit` view:

![Metadata in edit view](../media/metadata-edit-view.png)

Additional metadata in `import` view:

![Metadata in import view](../media/metadata-import-view.png)

