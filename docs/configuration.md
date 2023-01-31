# Configuration via Extension Params

The Media Gallery Extension is built to be customizable, but it also needs a Client ID and Secret to function at all. Here is a list of all configuration parameters that can be used with the extension:

| Property | Description | Default |
|----------|-------------|---------|
| `clientId` | ID for the API client used to fetch images from Content Hub. | N/A |
| `clientSecret` | Secret for the API client used to fetch images from Content Hub. | N/A |
| `configPath` | Name of the property containing the import config. This includes the previous import folder and query. | `galleryConfig` |
| `galleryPath` | Name of the property containing the images with metadata. | `photoGallery` |
| `metadataMap` | Specifies metadata from the images in Content Hub to copy and include on the content item, along with how they should be displayed/edited in the extension. See [Setting Exif Fields](./setting-exif-fields.md) for more information. | Simple map containing author and description. |
| `vse` | Optional VSE to use instead of the one provided by DC. | (from the api client) |

Parameters are read from both the instance and installation parameters, giving priority to configuration in the instance.

## Examples

Here is an example configuration with the default values:

```json
{
  "clientId": "<your client id>",
  "clientSecret": "<your client secret>",
  "configPath": "galleryConfig",
  "galleryPath": "photoGallery",
  "metadataMap": [
    {
      "source": "exif/artist",
      "target": "photographer",
      "label": "Artist",
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
      "label": "Description",
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

## Setting Exif Fields
See [Setting Exif Fields](./setting-exif-fields.md) for more information.