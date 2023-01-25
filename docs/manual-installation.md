# Manual Installation

## Register Extension

This extension needs to be registered against a Hub with in the Dynamic Content application (Developer -> Extensions), for it to load within that Hub.

### Setup

-   Category: Content Field
-   Label: Media Gallery
-   Name: media-gallery _(needs to be unique with the Hub)_
-   URL: your hosted HTTPS location for the extension
-   Description: Media Gallery _(can be left blank, if you wish)_

> Note:
> You can use our deployed version of this extension (builds from the "production" branch) - TBD

_As this is an open source project you're welcome to host your own "fork" of this project. You can use any standard static hosting service (Netlify, Amplify, Vercel, etc.) if you wish._

### Permissions

This extension requires no additional permissions.

# Example extension snippet

```json
{
	"type": "object",
	"ui:extension": {
		"name": "media-gallery"
	}
}
```

# Use

Example:

```json
"collection": {
    ...
}

```

## Setting up the Snippet in DC

Extension Snippets are an easy way to add extensions to content types while allowing you to easily change the extension url and base extension properties from one spot.

You can find a snippet to use for this extension in: `snippet.json`. Recommended description:

> Add a media gallery to this content item. This allows content authors to build galleries of images in their content items, along with storing relevant metadata.

You can even add your locally hosted media gallery extension this way for development, though note that it expects the extension url to be https. Our hosted version is a quick way to access the current version of the extension:

-   TBD
