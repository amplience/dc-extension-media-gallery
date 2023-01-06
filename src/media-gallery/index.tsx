import "./media-gallery.css"

import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import { useEffect, useState } from 'react'
import { ExtensionContextProvider, useExtension } from '../extension-context'
import { AssetWithExif, ChApi, EnrichedRepository } from '../ch-api'
import credentials from '../credentials'
import { convertToEntry, defaultExifMap } from '../model/conversion'
import { Box } from '@mui/material'

import Entry from '../model/entry'
import ImageDialog from '../components/ImageDialog'
import AppToolbar from '../components/AppToolbar'
import GridView from '../components/GridView'
import ItemListView from '../components/ItemListView'
import DetailDrawer from '../components/DetailDrawer'
import ImportDrawer from '../components/ImportDrawer'
import AppSnack from '../components/AppSnack'
import { AlertMessage, MediaItem } from '../model'
import ContextMenu from '../components/ContextMenu'

function assetToImg(asset: Entry): string {
  // TODO: use vse?
  const vse = '1v8j1gmgsolq81dxx8zx7pdehf.staging.bigcontent.io';

  return `https://${vse ?? asset.defaultHost}/i/${asset.endpoint}/${asset.name}`;
}

function assetsToItems(assets: Entry[]): MediaItem[] {
  return assets.map((asset, index) => ({
    id: index,
    selected: false,
    dateModified: '',
    img: assetToImg(asset),
    title: asset.description,
    author: asset.photographer,
    entry: asset
  }));
}

function itemsToAssets(items: MediaItem[]): Entry[] {
  return items.map(item => item.entry as Entry);
}

function MediaGallery() {
  const { field, setField, params } = useExtension();

  const { galleryPath, configPath } = params;

	// const theme = useTheme();
	// const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	// const isTablet = useMediaQuery(theme.breakpoints.down("md"));
	// const isLarge = useMediaQuery(theme.breakpoints.down("lg"));
	// const isXLarge = useMediaQuery(theme.breakpoints.down("xl"));

	// const [cols, setCols] = useState(6);
	const [zoom, setZoom] = useState(1)
	const [items, setItems] = useState<MediaItem[]>([])
	const [importItems, setImportItems] = useState<MediaItem[]>([])
	const [gridMode, setGridMode] = useState(true)
	const [repo, setRepo] = useState<EnrichedRepository>()
	const [chApi, setChApi] = useState<ChApi>()
	const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
	const [importDrawerOpen, setImportDrawerOpen] = useState(false)
	const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
	const sortOpen = Boolean(sortAnchorEl)
	const [dragging, setDragging] = useState(false)
	const [fullscreenView, setFullscreenView] = useState(false)
	const [contextMedia, setContextMedia] = useState<MediaItem | null>(null)
	const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null)
	const [tempMedia, setTempMedia] = useState<MediaItem | null>(null)
	const [snackOpen, setSnackOpen] = useState(false)
	const [infoPanelOpen, setInfoPanelOpen] = useState(false)
	const [currentAlert, setCurrentAlert] = useState<AlertMessage | null>(null)
	const [contextMenu, setContextMenu] = useState<{
		mouseX: number
		mouseY: number
	} | null>(null)

  useEffect(() => {
    if (field) {
      const data = assetsToItems(field[galleryPath]);
      setItems(data);
    }
  }, [field, galleryPath])

  useEffect(() => {
    if (field) {
      field[galleryPath] = itemsToAssets(items);
      if (setField) {
        setField();
      }
    }
  }, [field, galleryPath, setField, items]);

  const setDefaultFolder = (repoId: string, folderId: string) => {
    // Should also clear the last used query here if it's being replaced with a folder.

    field[configPath].repoId = repoId;
    field[configPath].folderId = folderId;

    if (setField) {
      setField();
    }
  }

	/**
	 * re-calculate cols
	 */
	// useEffect(() => {
	//   function handleResize() {
	//     if (isXLarge) setCols(Math.floor(6*zoom))
	//     if (isLarge) setCols(Math.floor(4*zoom))
	//     if (isTablet) setCols(Math.floor(3*zoom))
	//     if (isMobile) setCols(Math.floor(2*zoom))
	//   }
	//   window.addEventListener('resize', handleResize)
	// })

	/**
	 * Open context menu
	 * @param event
	 */
	const handleContextMenu = (event: React.MouseEvent) => {
		setContextMedia(null)
		event.preventDefault()
		if (event.target instanceof HTMLElement) {
			if (event.target.id) {
				const filteredItems = items.filter(
					(element: MediaItem) =>
						parseInt((event.target as HTMLElement).id) === element.id
				)
				console.log(filteredItems)
				if (filteredItems.length > 0) {
					setContextMedia(filteredItems[0])
				}
			}
		}
		setContextMenu(
			contextMenu === null
				? {
						mouseX: event.clientX + 2,
						mouseY: event.clientY - 6
				  }
				: // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
				  // Other native context menus might behave different.
				  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
				  null
		)
	}

	/**
	 * Close context menu
	 */
	const handleContextClose = () => {
		setContextMenu(null)
	}

	/**
	 * Opening alert
	 * TODO: move to components
	 */
	const handleSnackOpen = () => {
		setSnackOpen(true)
	}

	/**
	 * Closing alert
	 * TODO: move to components
	 * @param event
	 * @param reason
	 * @returns
	 */
	const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return
		}
		setSnackOpen(false)
	}

	/**
	 * Opening sort menu
	 * TODO: move to components
	 * @param event
	 */
	const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
		setSortAnchorEl(event.currentTarget)
	}

	/**
	 * Opening fullscreen view
	 * TODO: move to components
	 * @param media
	 */
	const handleFullScreenView = (media: MediaItem) => {
		setCurrentMedia(media)
		setFullscreenView(true)
	}

	/**
	 * Opening media details view
	 * TODO: move to components
	 * @param media
	 */
	const handleDetailView = (media: MediaItem) => {
		setCurrentMedia(media)
		setTempMedia(structuredClone(media))
		setDetailDrawerOpen(true)
	}

	/**
	 * Closing sort menu
	 * TODO: move to components
	 */
	const handleSortClose = () => {
		setSortAnchorEl(null)
	}

	/**
	 * Zoom in for grid mode
	 */
	const handleZoomIn = () => {
		if (zoom < 2) {
			setZoom(zoom * 2)
		}
	}

	/**
	 * Zoom out for grid mode
	 */
	const handleZoomOut = () => {
		if (zoom > 1 / 2) {
			setZoom(zoom / 2)
		}
	}

	/**
	 * Drag-and-drop sensors setup
	 * Using distance to enable icon buttons on images
	 * Using "Enter" key only to start and end drag-end-drop
	 * for the same reason
	 */
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8
			}
		}),
		useSensor(KeyboardSensor, {
			keyboardCodes: {
				start: ['Enter'],
				cancel: ['Escape'],
				end: ['Enter']
			},
			coordinateGetter: sortableKeyboardCoordinates
		})
	)

	/**
	 * Getting assets from Content Hub
	 * @param id
	 */
	const getEntries = async (id: string, query?: string): Promise<Entry[]> => {
		if (chApi && repo) {
      setDefaultFolder(repo.id, id);
	  	let assets: AssetWithExif[];

      if (query && query !== '') {
        assets = await chApi.queryAssetsExif({
          folderId: id,
          repoId: repo.id,
          query
        });
      } else {
        assets = await chApi.getExifByFolder(repo.id, id);
      }

			const entries = assets.map((asset) =>
				convertToEntry(asset, defaultExifMap, {
					endpoint: 'nmrsaalphatest',
					defaultHost: 'cdn.media.amplience.net'
				})
			)

			return entries
		}

		return []
	}

	/**
	 * Move focus from current active element
	 * @param offset
	 */
	const offsetActiveElementIndex = (offset: number) => {
		const element: Element | null = document.activeElement
		if (element) {
			const parent: HTMLElement | null = element.parentElement
			if (parent) {
				const children: HTMLCollection = parent.children
				if (children) {
					let found = -1
					for (let i = 0; i < children.length; i++) {
						if (children[i] === element) {
							found = i
						}
						if (found + offset < children.length && found + offset >= 0) {
							;(children.item(found + offset) as HTMLElement).focus()
						}
					}
				}
			}
		}
	}

	/**
	 * Keyboard shortcuts
	 */
	useEffect(() => {
		const keyDownHandler = (event: KeyboardEvent) => {
			const nonModalMode =
				!fullscreenView &&
				!importDrawerOpen &&
				!detailDrawerOpen &&
				!sortOpen &&
				!dragging &&
				!contextMenu
			if (nonModalMode) {
				if (event.key.toLowerCase() === 'i') {
					handleImport()
				} else if (event.key.toLowerCase() === 'a') {
					handleSelectAll()
				} else if (event.key.toLowerCase() === 'n') {
					handleSelectNone()
				} else if (event.key === 'Z') {
					handleResetItems()
				} else if (event.key === 'R') {
					handleRemoveSelected()
				} else if (event.key.toLowerCase() === 'g') {
					setGridMode(true)
				} else if (event.key.toLowerCase() === 'l') {
					setGridMode(false)
				} else if (event.key.toLowerCase() === 'v') {
					const element = document.activeElement as HTMLElement
					const id = parseInt(element.id)
					const item = getItem(id)
					if (item) {
						handleFullScreenView(item)
					}
				} else if (event.key.toLowerCase() === 'e') {
					const element = document.activeElement as HTMLElement
					const id = parseInt(element.id)
					const item = getItem(id)
					if (item) {
						handleDetailView(item)
					}
				} else if (event.key === 'r') {
					const element = document.activeElement as HTMLElement
					const id = parseInt(element.id)
					if (id) {
						removeItem(id)
					}
				} else if (event.key === ' ') {
					event.preventDefault()
					const element = document.activeElement as HTMLElement
					const id = parseInt(element.id)
					if (id) {
						selectItem(id) // Not working
					}
				} else if (event.key.toLowerCase() === 'm') {
					const element = document.activeElement as HTMLElement
					const id = element.id
					setContextMedia(items.find((item) => item.id === parseInt(id)) || null)
					setContextMenu({
						mouseX: element.getBoundingClientRect().x + 50,
						mouseY: element.getBoundingClientRect().y + 50
					})
				} else if (event.key.toLowerCase() === 's') {
					setSortAnchorEl(document.getElementById('toolbar-icon-sort'))
				} else if (event.key === 'ArrowRight') {
					offsetActiveElementIndex(1)
				} else if (event.key === 'ArrowLeft') {
					offsetActiveElementIndex(-1)
					// } else if (event.key === 'ArrowDown' && gridMode) {
					//   offsetActiveElementIndex(Math.floor(cols / zoom))
					// } else if (event.key === 'ArrowUp' && gridMode) {
					//   offsetActiveElementIndex(Math.floor(-cols / zoom))
				} else if (event.key === '-' && gridMode) {
					handleZoomOut()
				} else if (event.key === '+' && gridMode) {
					handleZoomIn()
					// } else if (event.key === 'ArrowDown' && !gridMode) {
					//   offsetActiveElementIndex(1)
					// } else if (event.key === 'ArrowUp' && !gridMode) {
					//   offsetActiveElementIndex(-1)
				}
			} else if (importDrawerOpen) {
				if (event.key.toLowerCase() === 'a') {
					handleSelectAllImportItems()
				} else if (event.key.toLowerCase() === 'n') {
					handleSelectNoneImportItems()
				}
			} else if (fullscreenView && event.key.toLowerCase() === 'i') {
				setInfoPanelOpen(!infoPanelOpen)
			}
		}
		document.addEventListener('keydown', keyDownHandler)
		return () => {
			document.removeEventListener('keydown', keyDownHandler)
		}
	})

	/**
	 * Getting folders from Content Hub
	 */
	useEffect(() => {
		;(async () => {
			const { clientId, clientSecret } = credentials

			if (clientId) {
				const gqlTest = new ChApi(
					'https://auth.amplience.net/oauth/token',
					'https://api.amplience.net/graphql'
				)
				await gqlTest.auth(clientId, clientSecret)
				setChApi(gqlTest)

				const result = await gqlTest.allReposWithFolders()
				console.log(result)
				setRepo(result[0])
			}
		})()
	}, [])

	/**
	 * Drag-end-Drop action start
	 * @param event
	 */
	const dragStart = (event: any) => {
		setDragging(true)
	}

	/**
	 * Drag-end-Drop action end
	 * @param event
	 */
	const dragEnd = (event: any) => {
		setDragging(false)
		const { active, over } = event
		if (active.id !== over.id) {
			const oldIndex = items.findIndex((item: MediaItem) => item.id === active.id)
			const newIndex = items.findIndex((item: MediaItem) => item.id === over.id)
			setItems(arrayMove(items, oldIndex, newIndex))
		}
	}

	/**
	 * Get an item from the collection
	 * @param id
	 */
	const getItem = (id: number) => {
		return items.find((item: MediaItem) => id === item.id)
	}

	/**
	 * Remove an item from the collection
	 * @param id
	 */
	const removeItem = (id: number) => {
		setItems((prevState: MediaItem[]) => {
			return prevState.filter((item: MediaItem) => id !== item.id)
		})
	}

	/**
	 * Select an item in the collection
	 * @param id
	 */
	const selectItem = (id: number) => {
		setItems((prevState: MediaItem[]) => {
			return prevState.map((item: MediaItem) => {
				const newItem = structuredClone(item)
				if (item.id === id) {
					newItem.selected = !item.selected
				}
				return newItem
			})
		})
	}

	/**
	 * Select an item in the import collection
	 * @param id
	 */
	const selectImportItem = (id: number) => {
		setImportItems((prevState: MediaItem[]) => {
			return prevState.map((item: MediaItem) => {
				if (item.id === id) item.selected = !item.selected
				return item
			})
		})
	}

	/**
	 * Select all items
	 */
	const handleSelectAll = () => {
		setItems((prevState: MediaItem[]) => {
			return prevState.map((element: MediaItem) => {
				element.selected = true
				return element
			})
		})
	}

	/**
	 * Un-select all items
	 */
	const handleSelectNone = () => {
		setItems((prevState: MediaItem[]) => {
			return prevState.map((element: MediaItem) => {
				element.selected = false
				return element
			})
		})
	}

	/**
	 * Remove selected items
	 */
	const handleRemoveSelected = () => {
		const itemsToDelete = items.filter((item: MediaItem) => item.selected)
		const numChanges = itemsToDelete.length
		if (numChanges > 0) {
			setItems((prev: MediaItem[]) => prev.filter((item: MediaItem) => !item.selected))
			setCurrentAlert({
				severity: 'success',
				message: `${numChanges} item${numChanges > 1 ? 's' : ''} removed successfully!`
			})
		} else {
			setCurrentAlert({
				severity: 'info',
				message: `No item selected`
			})
		}
		setTimeout(() => {
			handleSnackOpen()
		}, 500)
	}

	/**
	 * Reset collection
	 */
	const handleResetItems = () => {
		setItems([])
		setCurrentAlert({
			severity: 'success',
			message: 'Collection reset successfully!'
		})
		setTimeout(() => {
			handleSnackOpen()
		}, 500)
	}

	/**
	 * Prepare and open import drawer
	 */
	const handleImport = () => {
		/*
    const newItems = structuredClone(importItems)
    newItems.map((element: MediaItem) => {
      element.selected = false
      return element
    })
    */
		setImportItems([])
		setImportDrawerOpen(true)
	}

	/**
	 * Import new media in collection
	 */
	const importMedia = () => {
		setImportDrawerOpen(false)
		if (importItems.filter((item: MediaItem) => item.selected).length === 0) {
			setCurrentAlert({
				severity: 'info',
				message: 'No media file selected for import'
			})
			setTimeout(() => {
				handleSnackOpen()
			}, 500)
		} else {
			const newItems = structuredClone(items)
			const newSelectedItems = importItems
				.filter((item: MediaItem) => {
					return (
						item.selected &&
						items.filter((item2: MediaItem) => item2.id === item.id).length === 0
					)
				})
				.map((item: MediaItem) => {
					item.selected = false
					return item
				})
			setTimeout(() => {
				setItems(newItems.concat(structuredClone(newSelectedItems)))
			}, 500)
			if (newSelectedItems.length > 0) {
				setCurrentAlert({
					severity: 'success',
					message: `${newSelectedItems.length} new media file${
						newSelectedItems.length > 1 ? 's' : ''
					} successful imported!`
				})
			} else {
				setCurrentAlert({
					severity: 'info',
					message: `No new media file was imported`
				})
			}
			setTimeout(() => {
				handleSnackOpen()
			}, 1000)
		}
	}

	/**
	 * Save item
	 */
	const saveItem = () => {
		// TODO: move to function
		setDetailDrawerOpen(false)
		tempMedia &&
			setItems((prevState: MediaItem[]) => {
				return prevState.map((item: MediaItem) => {
					if (item.id === tempMedia.id) {
            tempMedia.entry.description = tempMedia.title;
            tempMedia.entry.photographer = tempMedia.author;
            item = tempMedia;
          }
					return item
				})
			})
		setCurrentAlert({
			severity: 'success',
			message: 'Media details successfully saved!'
		})
		setTimeout(() => {
			handleSnackOpen()
		}, 500)
	}

	/**
	 * Sort by date asc
	 */
	const handleSortByDateAsc = () => {
		setItems((prevState: MediaItem[]) => {
			return prevState
				.slice()
				.sort(
					(a: any, b: any) =>
						new Date(a.dateModified).getTime() - new Date(b.dateModified).getTime()
				)
		})
		handleSortClose()
	}

	/**
	 * Sort by date desc
	 */
	const handleSortByDateDesc = () => {
		setItems((prevState: MediaItem[]) => {
			return prevState
				.slice()
				.sort(
					(a: any, b: any) =>
						new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()
				)
		})
		handleSortClose()
	}

	/**
	 * Sort by author asc
	 */
	const handleSortByAuthorAsc = () => {
		setItems((prevState: MediaItem[]) => {
			return prevState
				.slice()
				.sort((a: any, b: any) => (a.author > b.author ? 1 : b.author > a.author ? -1 : 0))
		})
		handleSortClose()
	}

	/**
	 * Sort by author desc
	 */
	const handleSortByAuthorDesc = () => {
		setItems((prevState: MediaItem[]) => {
			return prevState
				.slice()
				.sort((a: any, b: any) => (b.author > a.author ? 1 : a.author > b.author ? -1 : 0))
		})
		handleSortClose()
	}

	/**
	 * Sort by caption asc
	 */
	const handleSortByCaptionAsc = () => {
		setItems((prevState: MediaItem[]) => {
			return prevState
				.slice()
				.sort((a: any, b: any) => (a.title > b.title ? 1 : b.title > a.title ? -1 : 0))
		})
		handleSortClose()
	}

	/**
	 * Sort by caption desc
	 */
	const handleSortByCaptionDesc = () => {
		setItems((prevState: MediaItem[]) => {
			return prevState
				.slice()
				.sort((a: any, b: any) => (b.title > a.title ? 1 : a.title > b.title ? -1 : 0))
		})
		handleSortClose()
	}

	/**
	 * Select all import items
	 */
	const handleSelectAllImportItems = () => {
		setImportItems((prevState: MediaItem[]) => {
			return prevState.map((element: MediaItem) => {
				element.selected = true
				return element
			})
		})
	}

	/**
	 * De-select all import items
	 */
	const handleSelectNoneImportItems = () => {
		setImportItems((prevState: MediaItem[]) => {
			return prevState.map((element: MediaItem) => {
				element.selected = false
				return element
			})
		})
	}

	return (
		<>
			{/* Image full screen view */}
			{/* TODO: mode styles for all components */}
			<ImageDialog
				fullscreenView={fullscreenView}
				currentMedia={currentMedia}
				infoPanelOpen={infoPanelOpen}
				setFullscreenView={setFullscreenView}
				setInfoPanelOpen={setInfoPanelOpen}
			/>
			<Box style={{ width: '100%' }}>
				{/* Toolbar */}
				<AppToolbar
					gridMode={gridMode}
					items={items}
					handleImport={handleImport}
					handleRemoveSelected={handleRemoveSelected}
					handleContextMenu={handleContextMenu}
					handleResetItems={handleResetItems}
					handleSelectAll={handleSelectAll}
					handleSelectNone={handleSelectNone}
					handleSortByAuthorAsc={handleSortByAuthorAsc}
					handleSortByAuthorDesc={handleSortByAuthorDesc}
					handleSortByCaptionAsc={handleSortByCaptionAsc}
					handleSortByCaptionDesc={handleSortByCaptionDesc}
					handleSortByDateAsc={handleSortByDateAsc}
					handleSortByDateDesc={handleSortByDateDesc}
					handleSortClick={handleSortClick}
					handleSortClose={handleSortClose}
					handleZoomIn={handleZoomIn}
					handleZoomOut={handleZoomOut}
					setGridMode={setGridMode}
					sortAnchorEl={sortAnchorEl}
					sortOpen={sortOpen}
					zoom={zoom}
				/>

				{/* Context Menu */}
				<ContextMenu
					contextMenu={contextMenu}
					contextMedia={contextMedia}
					gridMode={gridMode}
					selectItem={selectItem}
					handleContextClose={handleContextClose}
					handleFullScreenView={handleFullScreenView}
					handleDetailView={handleDetailView}
					handleImport={handleImport}
					handleSelectAll={handleSelectAll}
					handleSelectNone={handleSelectNone}
					handleRemoveSelected={handleRemoveSelected}
					handleSortClick={handleSortClick}
					handleResetItems={handleResetItems}
					handleZoomIn={handleZoomIn}
					handleZoomOut={handleZoomOut}
					items={items}
					removeItem={removeItem}
					setGridMode={setGridMode}
					zoom={zoom}
				/>

				{/* Main view */}
				<Box sx={{ w: '100%', pr: 2, pl: 2 }} onContextMenu={handleContextMenu}>
					{gridMode ? (
						// Grid view
						<GridView
							sensors={sensors}
							items={items}
							dragEnd={dragEnd}
							dragStart={dragStart}
							zoom={zoom}
							handleDetailView={handleDetailView}
							handleFullScreenView={handleFullScreenView}
							selectItem={selectItem}
							removeItem={removeItem}
						/>
					) : (
						// List view
						<ItemListView
							sensors={sensors}
							items={items}
							dragEnd={dragEnd}
							dragStart={dragStart}
							zoom={zoom}
							handleDetailView={handleDetailView}
							handleFullScreenView={handleFullScreenView}
							selectItem={selectItem}
							removeItem={removeItem}
						/>
					)}
				</Box>

				{/* Image detail drawer */}
				<DetailDrawer
					currentMedia={currentMedia}
					tempMedia={tempMedia}
					saveItem={saveItem}
					detailDrawerOpen={detailDrawerOpen}
					setDetailDrawerOpen={setDetailDrawerOpen}
					handleFullScreenView={handleFullScreenView}
				/>

				{/* Import media drawer */}
				{/* TODO: move to components */}
				<ImportDrawer
					repo={repo}
					importDrawerOpen={importDrawerOpen}
					setImportDrawerOpen={setImportDrawerOpen}
					getEntries={getEntries}
					setImportItems={setImportItems}
					assetsToItems={assetsToItems}
					handleSelectAllImportItems={handleSelectAllImportItems}
					handleSelectNoneImportItems={handleSelectNoneImportItems}
					importItems={importItems}
					handleFullScreenView={handleFullScreenView}
					selectImportItem={selectImportItem}
					importMedia={importMedia}
				/>
			</Box>
			<Box sx={{ width: '100%', flexGrow: 1 }} onContextMenu={handleContextMenu} />

			{/* Snack Bar for alerts */}
			<AppSnack
				snackOpen={snackOpen}
				handleSnackClose={handleSnackClose}
				currentAlert={currentAlert}
			/>
		</>
	)
}

export default MediaGallery;