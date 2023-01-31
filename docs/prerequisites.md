# Prerequisites

In order to use this extension, there are some pre-requisites that are required in your Amplience account.

# Dynamic Content API / User permissions
In order to register the extension, you will need the ability to register extensions and create schemas and content types which is either the Developer or Customer Admin [Persona](https://amplience.com/developers/docs/concepts/permissions/).

# Content Hub API
The extension interfaces with the Content Hub API's in order to browse folders, get assets and associated metadata to import into your content item. For this you will need a client ID and secret for your API user with the following:

- Access to the asset stores you want to be able to browse.
- Ability to search assets.
- Ability to get metadata for assets.

If you already have an existing API client, you can ask for updated permissions via the support desk.

# Virtual Staging API Settings
When authoring content, in order to see media that might not be published, this extension uses our [Virtual Staging Environment](https://amplience.com/developers/docs/dev-tools/guides-tutorials/virtual-staging/) APIs to see the media assets in the extension. Therefore, your configured VSE needs access to the asset stores which the extension can browse. 

> Note: You do not require the ability to get any specific metadata for these assets as that is perfomed on a management API level.

# Required information for registering the extension
- API credentials
    - clientID
    - clientSecret
- Metadata information
    - Schema ID for the schema you want the information from.
    - Metadata map. What attributes in the metadata schema map to which properties in your content type. See [Setting Exif Fields](./setting-exif-fields.md) for more information.
- Storage information
    - Where to store configuration values, such as the last import's folder, repo and query. This is used to notify the user when there are changes since the last import, and so they can be easily imported.


