# Setting EXIF fields

You can add additional metadata in the different views of the extension. This can be done by editing the extension's installation parameters. 

Here is a sample configuration with photographer and caption metadata.

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
| `source` | for now, the source can only be an EXIF field, prefixed with `exif/` |
| `target` | the target field for the additional metadata, this needs to appear in your Media Gallery schema |
| `label` | label for the different views |
| `type` | you can choose from string or multiline |
| `editable` | specify if the field is read-only or editable in the details drawer |
| `sortable` | specify if the field appears in the sort menu |
| `icon` | you can choose `author` or `text` for the field icon |
| `visibility` | you can control the visibility of the field in the different views - `grid`, `list`, `info`, `edit`, `import` (see below) |

Field visibility:

| keyword | View |
|---------|------|
| `grid` | grid view as additional lines |
| `list` | list view as additional columns |
| `info` | info panel in fullscreen view as additional rows |
| `edit` | edit drawer as additional read-only or editable fields |
| `import` | import grid view as additional lines |

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

