[![Amplience Dynamic Content](media/header.png)](https://amplience.com/dynamic-content)

![Dynamic Content Media Gallery Extension](media/mouse-drag-and-drop.png)

# Dynamic Content Media Gallery Extension

This extension allows you to manage a collection of image items easily, with import froma specified Content Hub, drag-and-drop, sorting, grid and list view.

-   [Prerequisites](./docs/prerequisites.md)

## Quick Install

If you have your Media Hub Client Id and Secret the extension will link out to, there is an `npm` script that will install the extension to your DC Hub:

```
$ npm i
$ npm run import --extensionClientId [your_client_id] --extensionClientSecret [your_client_secret] --extensionVSE [optional_vse_url]
```

## Table of Contents

-   Extension installation
    -   [Installing with `dc-cli` tool](./docs/cli-installation.md)
    -   [Manual Installation](./docs/manual-installation.md)
-   [Configuration via Extension Params](./docs/configuration.md)
    -   [Setting EXIF fields](./docs/setting-exif-fields.md)
-   [Features](./docs/features.md)
    -   [Toolbar](./docs/features.md#toolbar)
    -   [Import Media](./docs//features.md#import-media)
    -   [View Media](./docs//features.md#view-media)
    -   [Edit Media](./docs//features.md#edit-media)
    -   [Grid View](./docs//features.md#grid-view)
    -   [List View](./docs//features.md#list-view)
    -   [Context Menu](./docs//features.md#context-menu)
    -   [Notifications](./docs//features.md#notifications)
    -   [Keyboard Shortcuts](./docs//features.md#keyboard-shortcuts)
    -   [Manual Re-ordering](./docs//features.md#manual-re-ordering)
    -   [Sorting By](./docs//features.md#sorting-by)
-   Additional Topics
    -   [Buidling Locally](./docs/building-locally.md)
    -   [Available NPM Scripts](./docs/npm-scripts.md)
