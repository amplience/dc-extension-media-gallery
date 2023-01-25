# Installing with `dc-cli` tool

We've included several [automation files](./amplience-automation/automation-files/) to enable installing the extension and a 'starter' Content Schema and Type via the command line. An Extension Snippet is also included in the extension automation file which will enable you to easily add the extension to any existing Content Schemas.

To make use of the automation files you should either clone the [dc-extension-media-gallery](https://github.com/amplience/dc-extension-media-gallery) or download the repository as a [ZIP file.](https://github.com/amplience/dc-extension-media-gallery/archive/refs/heads/main.zip)

```
git clone https://github.com/amplience/dc-extension-media-gallery.git
```

To get started, navigate to the root directory of the project.

<!-- An Extension Snippet is also included in the extension automation file which will enable you to easily add the extension to any existing Content Schemas.

![Add Extension via Snippet in DC](./media/addExtensionUI.png) -->

## Setup & Use `dc-cli`

You'll need to install and configure `dc-cli`. Here are [detailed instructions](https://github.com/amplience/dc-cli#installation). NOTE that you will need your DC Hub ID, `clientId` and `clientSecret`.

Once you have `dc-cli` installed and pointing to your DC Hub, the commands to install everyting are as follows:

```
$ dc-cli extension import ./amplience-automation/automation-files/extensions/
```

```
$ dc-cli content-type-schema import ./amplience-automation/automation-files/schema/
```

```
$ dc-cli content-type import ./amplience-automation/automation-files/type/
```

After these running commands, the media gallery content type will now be available for use. It's recommended that you change the [extension parameters](./configuration.md) to point to your Content Hub client and secret, to match the information you want to extract from the metadata, and to fit the structure of the content you want to create.