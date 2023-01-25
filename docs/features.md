# Features

## Toolbar

![Toolbar](../media/toolbar.png)

You can perform the following actions from the toolbar:

| icons | actions |
|-------|---------|
| ![Import icon](../media/icon-import.png)  | import new media items |
| ![Select all icon](../media/icon-select-all.png) ![De-select all icon](../media/icon-select-none.png) | select and deselect all media item |
| ![Remove icon](../media/icon-remove.png) | remove selected media items |
| ![Sort icon](../media/icon-sort.png) | sort collection (by date mofified, name and additional metatdata, for instance author, caption) |
| ![Reset icon](../media/icon-reset.png) | reset collection |
| ![Zoom in icon](../media/icon-zoom-in.png) ![Zoom out icon](../media/icon-zoom-out.png) | zoom in, zoom out in grid view |
| ![List view icon](../media/icon-list.png) ![Grid view icon](../media/icon-grid.png) | switch betwen list and grid view |

> Note: the application logo on the left can be clicked to open the context menu

## Import media

If you have previsouly imported media from a specific folder, and potentially a query, an alert bar provides information about:
- available items: items in the folder not in your media collection yet
- updated items: items that have been updated in Content Hub
- out-of-sync items: iterms that you have manullay updated locally in your collection

![Import alert bar](../media/import-alert-bar.png)

When opening the import drawer, you can do the following actions:
- navigate and choose a folder in Content Hub
- once a folder is selected, you can refine your selection using a query
- you can see available, updated and out-of-sync items
- you can select all, all updated, all out-of-sync items or deselect all
- you can import your selection or cancel and close the drawer

![Import drawer selection](../media/import-drawer-selection.png)

After import, a notification will display the number of items imported, and the import alert bar will be updated or closed if nothing can be imported from your last folder / query selection:

![Import alert bar after import](../media/import-alert-bar-after-import.png)

## View media

![View item](../media/view-item.png)

You can quickly view an item full-width by clicking on its thumbnail in **grid**, **list**, **edit** or **import** view. You can also use the `v` keyboard shortcut when focusing on an item, or use the context menu when right clicking on an item. You can see all details using the information icon `i`.

## Edit media

![Edit item](../media/edit-item.png)

You can edit an item details by clicking on the view icon in grid or list view. You can also use the `e` keyboard shortcut when focusing on an item, or use the context menu when right clicking on an item.

Date modified and name are read only and you can view or edit additional metadata if available, for instance author and caption. Once saved, a notification will appear.

## Grid View

![Grid View](../media/grid-view.png)

## List View

![List View](../media/list-view.png)

## Context Menu

![Context Menu](../media/context-menu.png)

Context menu with all possible action can be opened when right clicking on a specific media item, on the top left icon, or anywhere else on the interface, as well as using the `m` keyboard shortcut.

## Notifications

![Notification](../media/notification.png)

For some actions, notifications can appear on the top left corner of the interface:

-   removing multiple media items
-   importing new media items
-   resetting the collection

## Keyboard Shortcuts

For accessibility, the extension can also be used using the following shortcuts, as appearing on the context menu:

![Context Menu](../media/context-menu.png)

Item-specific actions:

| key | action |
|-----|--------|
| `space` | select / de-select item |
| `v` | view currently focused item |
| `e` | edit currently focused item |
| `r` | remove currently focused item |
| `t` | move currently focused item to top |
| `b` | move currently focused item to bottom |

Global actions:

| key | action |
|-----|--------|
| `i` | open the import drawer |
| `a` | select all items |
| `n` | deselect all items |
| `R` | remove selected items |
| `s` | sort items |
| `Z` | reset collection |
| `+` | zoom in grid view (one level only) |
| `-` | zoom out grid view (one level only) |
| `l` | switch to list view |
| `g` | switch to grid view |
| `m` | open context menu |
| `right and left arrows` | move focus to next / previous item in grid and list views |

Drag-and-drop actions:

| key | action |
|-----|--------|
| `return` | start / end keyboard drag-and-drop |
| `arrows` | move dragged item (you might need to press `space` to scroll the view) |
| `escape` | cancel keyboard drag-and-drop |

## Manual re-ordering

![Mouse Drag-and-drop](../media/mouse-drag-and-drop.png)

The interface offers drag-and-drop to manually re-order media items in the collection.

![Keyboard Drag-and-drop](../media/keyboard-drag-and-drop.png)

For accessibility, the interface also offers to use the keyboard to re-order items. You can follow these steps:

-   focus an item using the `tab` key
-   move focus using arrow keys
-   trigger drag-and-drop using the `return` key
-   move the item using the arrow keys
-   end drag-and-drop and position the item using the `return` key again

## Sorting by

![Sort collection](../media/sort-by.png)

You can automatically sort the collection by:

-   modified date ascending
-   modified date descending
-   name ascending
-   name descending
-   additional metadata ascending and descending

After a collection has been sorted, you can manually re-order using drag-and-drop.
