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

You can configure a new metadata using:
- source: for now, the source can only be an EXIF field, prefixed with `exif/`
- target: the target field for the additional metadata, this needs to appear in your Media Gallery schema
- label: label for the different views
- type: you can choose from string or multiline
- editable: specify if the field is read-only or editable in the details drawer
- sortable: specify if the field appears in the sort menu
- icon: you can choose `author` or `text` for the field icon
- visibility: you can control the visibility of the field in the different views - `edit`, `import`, `grid`, `list` or `info` (see below)

Field visibility:

| keyword | View |
|---------|------|
| `grid` | Grid view as additional lines |
| `list` | List view as additional columns |
| `import` | Import grid view as additional lines |
| `edit` | Edit drawer as additional read-only or editable fields |
| `info` | Info panel in fullscreen view as additional rows |
