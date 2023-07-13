![Dynamic Content Media Gallery Extension](media/mouse-drag-and-drop.png)

# Dynamic Content Media Gallery Extension

This extension allows you to manage a collection of image items easily, with import from a specified Content Hub, drag-and-drop, sorting, grid and list view.

-   [Prerequisites](./docs/prerequisites.md)

## Dependency versions
This extension was developed and tested with:
- Node version `18.x`
- NPM version `9.x`

## Quick Install

To run the `npm` install scripts, you'll need to install some dependencies:

```
$ npm i
```

Then, if you have your DC Hub Client Id and Secret, run the following `npm` script to install the extension to your DC Hub:

```
$ npm run import -- \
    --clientId [your_client_id] \
    --clientSecret [your_client_secret] \
    --hubId [your_hub_id]
```

> NOTE: the above flags are required

If you also have the Media Hub Client Id and Secret the extension will link out to, include the `--extensionClientId` and `--extensionClientSecret` flags, with an OPTIONAL `--extensionVSE` flag

```
$ npm run import -- \
    --clientId [your_client_id] \
    --clientSecret [your_client_secret] \
    --hubId [your_hub_id] \
    --extensionClientId [your_mediahub_client_id] \
    --extensionClientSecret [your_mediahub_client_secret] \
    --extensionVSE [optional_vse_url]
```

## Table of Contents

-   [Manual Installation](./docs/manual-installation.md)
-   [Configuration via Extension Params](./docs/configuration.md)
    -   [Setting EXIF fields](./docs/setting-exif-fields.md)
-   [Features](./docs/features.md)
    -   [Toolbar](./docs/features.md#toolbar)
    -   [Import Media](./docs/features.md#import-media)
    -   [View Media](./docs/features.md#view-media)
    -   [Edit Media](./docs/features.md#edit-media)
    -   [Grid View](./docs/features.md#grid-view)
    -   [List View](./docs/features.md#list-view)
    -   [Context Menu](./docs/features.md#context-menu)
    -   [Notifications](./docs/features.md#notifications)
    -   [Keyboard Shortcuts](./docs/features.md#keyboard-shortcuts)
    -   [Manual Re-ordering](./docs/features.md#manual-re-ordering)
    -   [Sorting By](./docs/features.md#sorting-by)
-   Additional Topics
    -   [Buidling Locally](./docs/building-locally.md)
    -   [Available NPM Scripts](./docs/npm-scripts.md)
