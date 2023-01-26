import {
	useSensors,
	useSensor,
	PointerSensor,
	KeyboardSensor,
	SensorDescriptor,
	SensorOptions
} from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import React, { useEffect, useState, useContext, ReactNode, Dispatch, SetStateAction } from 'react'
import { GqlChApi } from '../ch-api/gql-ch-api'
import { AlertMessage, MediaItem } from '../model'
import { assetsToItems, convertToEntry, itemsToAssets } from '../model/conversion'
import Entry from '../model/entry'
import { useExtension } from '../extension-context'
import IChApi from '../ch-api/i-ch-api'
import { RestChApi } from '../ch-api/rest-ch-api'
import { AssetWithExif, EnrichedRepository, sortRepos } from '../ch-api/shared'

type AppContextData = {
	zoom: number
	setZoom?: Dispatch<SetStateAction<number>>
	initialItems: MediaItem[]
	setInitialItems?: Dispatch<SetStateAction<MediaItem[]>>
	items: MediaItem[]
	setItems?: Dispatch<SetStateAction<MediaItem[]>>
	importItems: MediaItem[] | null
	setImportItems?: Dispatch<SetStateAction<MediaItem[]>>
	gridMode: boolean
	setGridMode?: Dispatch<SetStateAction<boolean>>
	repos?: EnrichedRepository[] | null
	setRepos?: Dispatch<SetStateAction<EnrichedRepository[] | undefined>>
	chApi?: any
	setChApi?: Dispatch<SetStateAction<IChApi | undefined>>
	detailDrawerOpen?: boolean
	setDetailDrawerOpen?: Dispatch<SetStateAction<boolean>>
	importDrawerOpen?: boolean
	setImportDrawerOpen?: Dispatch<SetStateAction<boolean>>
	sortAnchorEl?: HTMLElement | null
	setSortAnchorEl?: Dispatch<SetStateAction<HTMLElement | null>>
	sortOpen: boolean
	dragging?: boolean
	setDragging?: Dispatch<SetStateAction<boolean>>
	fullscreenView: boolean
	setFullscreenView?: Dispatch<SetStateAction<boolean>>
	contextMedia: MediaItem | null
	setContextMedia?: Dispatch<SetStateAction<MediaItem | null>>
	currentMedia: MediaItem | null
	setCurrentMedia?: Dispatch<SetStateAction<MediaItem | null>>
	tempMedia?: Entry | null
	setTempMedia?: Dispatch<SetStateAction<Entry | null>>
	snackOpen?: boolean
	setSnackOpen?: Dispatch<SetStateAction<boolean>>
	infoPanelOpen?: boolean
	setInfoPanelOpen?: Dispatch<SetStateAction<boolean>>
	currentAlert?: AlertMessage | null
	setCurrentAlert?: Dispatch<SetStateAction<AlertMessage | null>>
	contextMenu: { mouseX: number; mouseY: number } | null
	setContextMenu?: Dispatch<SetStateAction<{ mouseX: number; mouseY: number } | null>>
	dragStart?: (event: any) => void
	dragEnd?: (event: any) => void
	handleContextClose: () => void
	handleContextMenu: (event: React.MouseEvent) => void
	handleDetailView: (media: MediaItem) => void
	handleFullScreenView: (media: MediaItem) => void
	handleImport: () => void
	handleRemoveSelected: () => void
	handleResetItems: () => void
	handleSelectAll: () => void
	handleSelectAllImportItems: () => void
	handleSelectAllUpdatedImportItems: () => void
	handleSelectAllOutOfSyncImportItems: () => void
	handleSelectNone: () => void
	handleSelectNoneImportItems: () => void
	handleSnackClose: () => void
	handleSnackOpen: () => void
	handleSortByDateAsc: () => void
	handleSortByDateDesc: () => void
	handleSortByNameAsc: () => void
	handleSortByNameDesc: () => void
	handleSortClick: (event: React.MouseEvent<HTMLElement>) => void
	handleSortClose: () => void
	handleZoomIn: () => void
	handleZoomOut: () => void
	handleResetZoom: () => void
	handleSortByMetaAsc: (key: string) => void
	handleSortByMetaDesc: (key: string) => void
	handleMoveToTop: (media: MediaItem) => void
	handleMoveToBottom: (media: MediaItem) => void
	importMedia: () => void
	sensors?: SensorDescriptor<SensorOptions>[]
	getEntries?: (repoId: string, id: string, query?: string) => Promise<Entry[]>
	getItem?: (id: string) => MediaItem | undefined
	removeItem: (id: string) => void
	selectImportItem: (id: string) => void
	selectItem: (id: string) => void
	saveItem?: () => void
	dragOrder: (active: any, over: any) => void
	error?: string
	setError: (error: string | undefined) => void
	entries: Entry[]
}

const defaultAppState = {
	zoom: 1,
	items: [],
	initialItems: [],
	importItems: [],
	gridMode: true,
	fullscreenView: false,
	contextMedia: null,
	repo: null,
	chApi: null,
	detailDrawerOpen: false,
	importDrawerOpen: false,
	sortAnchorEl: null,
	sortOpen: false,
	currentMedia: null,
	contextMenu: null,
	handleDetailView: (media: MediaItem) => {},
	handleFullScreenView: (media: MediaItem) => {},
	selectItem: (id: string) => {},
	removeItem: (id: string) => {},
	handleContextMenu: (event: React.MouseEvent) => {},
	handleContextClose: () => {},
	handleImport: () => {},
	handleSelectAll: () => {},
	handleSelectNone: () => {},
	handleRemoveSelected: () => {},
	handleResetItems: () => {},
	handleSelectAllImportItems: () => {},
	handleSelectAllUpdatedImportItems: () => {},
	handleSelectAllOutOfSyncImportItems: () => {},
	handleSelectNoneImportItems: () => {},
	handleSnackClose: () => {},
	handleSnackOpen: () => {},
	handleSortByDateAsc: () => {},
	handleSortByDateDesc: () => {},
	handleSortByNameAsc: () => {},
	handleSortByNameDesc: () => {},
	handleSortClick: (event: React.MouseEvent<HTMLElement>) => {},
	handleSortClose: () => {},
	handleZoomIn: () => {},
	handleZoomOut: () => {},
	handleResetZoom: () => {},
	handleSortByMetaAsc: (key: string) => {},
	handleSortByMetaDesc: (key: string) => {},
	handleMoveToTop: () => {},
	handleMoveToBottom: () => {},
	importMedia: () => {},
	selectImportItem: (id: string) => {},
	dragOrder: (active: any, over: any) => {},
	setError: (error: string | undefined) => {},
	entries: []
}

interface DefaultFolder {
	folderId: string
	repoId: string
	query?: string
}

export const AppContext = React.createContext<AppContextData>(defaultAppState)

export function AppContextProvider({ children }: { children: ReactNode }) {
	const { field, setField, params, sdk } = useExtension()
	const { galleryPath, configPath } = params

	const [state, setState] = useState<AppContextData>(defaultAppState)
	const [zoom, setZoom] = useState(1)
	const [dragging, setDragging] = useState(false)
	const [initialItems, setInitialItems] = useState<MediaItem[]>([])
	const [items, setItems] = useState<MediaItem[]>([])
	const [importItems, setImportItems] = useState<MediaItem[]>([])
	const [gridMode, setGridMode] = useState(true)
	const [repos, setRepos] = useState<EnrichedRepository[]>()
	const [chApi, setChApi] = useState<IChApi>()
	const [endpoint, setEndpoint] = useState<string>()
	const [error, setError] = useState<string>()
	const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
	const [importDrawerOpen, setImportDrawerOpen] = useState(false)
	const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
	const sortOpen = Boolean(sortAnchorEl)
	const [fullscreenView, setFullscreenView] = useState(false)
	const [contextMedia, setContextMedia] = useState<MediaItem | null>(null)
	const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null)
	const [tempMedia, setTempMedia] = useState<Entry | null>(null)
	const [snackOpen, setSnackOpen] = useState(false)
	const [infoPanelOpen, setInfoPanelOpen] = useState(false)
	const [currentAlert, setCurrentAlert] = useState<AlertMessage | null>(null)
	const [contextMenu, setContextMenu] = useState<{
		mouseX: number
		mouseY: number
	} | null>(null)

	const [entries, setEntries] = useState<Entry[]>([])
	const [pendingDefaultFolder, setPendingDefaultFolder] = useState<DefaultFolder>()

	const dragOrder = (active: any, over: any) => {
		const oldIndex = items.findIndex((item: MediaItem) => item.id === active.id)
		const newIndex = items.findIndex((item: MediaItem) => item.id === over.id)
		//setItems(arrayMove(items, oldIndex, newIndex))
		setItems((prev: MediaItem[]) => (prev = arrayMove(items, oldIndex, newIndex)))
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
	 * Close context menu
	 */
	const handleContextClose = () => {
		setContextMenu(null)
	}

	/**
	 * Opening alert
	 */
	const handleSnackOpen = () => {
		setSnackOpen(true)
	}

	/**
	 * Closing alert
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
	 * @param event
	 */
	const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
		setSortAnchorEl(event.currentTarget)
	}

	/**
	 * Opening fullscreen view
	 * @param media
	 */
	const handleFullScreenView = (media: MediaItem) => {
		setCurrentMedia(media)
		setFullscreenView(true)
	}

	/**
	 * Opening media details view
	 * @param media
	 */
	const handleDetailView = (media: MediaItem) => {
		setCurrentMedia(media)
		const temp = structuredClone(media.entry)
		temp.id = media.id
		setTempMedia(temp)
		setDetailDrawerOpen(true)
	}

	/**
	 * Closing sort menu
	 */
	const handleSortClose = () => {
		setSortAnchorEl(null)
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
	 * Getting folders from Content Hub
	 */
	useEffect(() => {
		;(async () => {
			if (params.clientId) {
				const isGraphQL = false

				let api: IChApi

				if (isGraphQL) {
					api = new GqlChApi(
						'https://auth.amplience.net/oauth/token',
						'https://api.amplience.net/graphql'
					)
				} else {
					api = new RestChApi(
						'https://auth.amplience.net/oauth/token',
						'https://dam-api-internal.amplience.net/v1.5.0/'
					)
				}

				try {
					await api.auth(params.clientId, params.clientSecret)
				} catch (e: any) {
					setError(e.message)
					return
				}

				setEndpoint(await api.getEndpoint())
				setChApi(api)

				const result = await api.allReposWithFolders()
				sortRepos(result)
				setRepos(result)
			}
		})()
	}, [params])

	/**
	 * Remove an item from the collection
	 * @param id
	 */
	const removeItem = (id: string) => {
		setItems((prevState: MediaItem[]) => {
			return prevState.filter((item: MediaItem) => id !== item.id)
		})
	}

	/**
	 * Select an item in the collection
	 * @param id
	 */
	const selectItem = (id: string) => {
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
	const selectImportItem = (id: string) => {
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
	 * Prepare and open import drawer
	 */
	const handleImport = () => {
		setImportItems([])
		setImportDrawerOpen(true)
	}

	/**
	 * Select all import items
	 */
	const handleSelectAllImportItems = () => {
		setImportItems((prevState: MediaItem[]) => {
			return prevState.map((element: MediaItem) => {
				if (!element.disabled) {
					element.selected = true
				}
				return element
			})
		})
	}

	/**
	 * Select all updated import items
	 */
	const handleSelectAllUpdatedImportItems = () => {
		setImportItems((prevState: MediaItem[]) => {
			return prevState.map((element: MediaItem) => {
				if (!element.disabled && element.updated) {
					element.selected = true
				}
				return element
			})
		})
	}

	/**
	 * Select all out-of-sync import items
	 */
	const handleSelectAllOutOfSyncImportItems = () => {
		setImportItems((prevState: MediaItem[]) => {
			return prevState.map((element: MediaItem) => {
				if (!element.disabled && element.outOfSync) {
					element.selected = true
				}
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

	useEffect(() => {
		if (field) {
			const data = assetsToItems(field[galleryPath], params)
			setItems(data)
			if (initialItems.length === 0) {
				setInitialItems(data)
			}
		}
	}, [field, galleryPath, params])

	useEffect(() => {
		if (field) {
			field[galleryPath] = itemsToAssets(items)
			if (setField) {
				setField()
			}
		}
	}, [field, galleryPath, setField, items])

	useEffect(() => {
		if (chApi) {
			const config = field[params.configPath]
			if (config && config.repoId && config.folderId && state.getEntries) {
				state.getEntries(config.repoId, config.folderId, config.query)
			}
		}
	}, [chApi])

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
					handleResetZoom()
					setGridMode(false)
				} else if (event.key.toLowerCase() === 'v') {
					const element = document.activeElement as HTMLElement
					const item = getItem(element.id)
					if (item) {
						handleFullScreenView(item)
					}
				} else if (event.key.toLowerCase() === 'e') {
					const element = document.activeElement as HTMLElement
					const item = getItem(element.id)
					if (item) {
						handleDetailView(item)
					}
				} else if (event.key === 'r') {
					const element = document.activeElement as HTMLElement
					if (element.id) {
						removeItem(element.id)
					}
				} else if (event.key === ' ') {
					event.preventDefault()
					const element = document.activeElement as HTMLElement
					if (element.id) {
						selectItem(element.id)
					}
				} else if (event.key.toLowerCase() === 'm') {
					const element = document.activeElement as HTMLElement
					const item = getItem(element.id)
					if (item) {
						setContextMedia(item)
					}
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
				} else if (event.key === 't') {
					console.log(event.key)
					const element = document.activeElement as HTMLElement
					const item: MediaItem | undefined = getItem(element.id)
					console.log(item)
					if (item) handleMoveToTop(item)
				} else if (event.key === 'b') {
					const element = document.activeElement as HTMLElement
					const item: MediaItem | undefined = getItem(element.id)
					if (item) handleMoveToBottom(item)
				}
			} else if (importDrawerOpen) {
				if (event.key.toLowerCase() === 'a') {
					handleSelectAllImportItems()
				} else if (event.key.toLowerCase() === 'n') {
					handleSelectNoneImportItems()
				} else if (event.key.toLowerCase() === 'u') {
					handleSelectAllUpdatedImportItems()
				} else if (event.key.toLowerCase() === 'o') {
					handleSelectAllOutOfSyncImportItems()
				}
			} else if (fullscreenView && event.key.toLowerCase() === 'i') {
				setInfoPanelOpen(!infoPanelOpen)
			}
		}
		document.addEventListener('keydown', keyDownHandler)

		const setDefaultFolder = (repoId: string, folderId: string, query?: string) => {
			// Should also clear the last used query here if it's being replaced with a folder.

			field[configPath].repoId = repoId
			field[configPath].folderId = folderId
			field[configPath].query = query

			if (setField) {
				setField()
			}
		}

		/**
		 * Reset collection
		 */
		const handleResetItems = async () => {
			if (field && sdk && setField) {
				//console.log('field: ', field)

				// resetValue does not exist. docs incorrect
				//await sdk.field.resetValue()

				// reset does nothing
				await sdk.field.reset()
				setItems(
					initialItems.map((item) => {
						item.selected = false
						return item
					})
				)
				setField()
			}
			//setItems([])
			setCurrentAlert({
				severity: 'success',
				message: 'Collection reset successfully!'
			})
			setTimeout(() => {
				handleSnackOpen()
			}, 500)
		}

		/**
		 * Getting assets from Content Hub
		 * @param id
		 */
		const getEntries = async (repoId: string, id: string, query?: string): Promise<Entry[]> => {
			if (chApi && repoId && endpoint) {
				setPendingDefaultFolder({ repoId, folderId: id, query })
				//const assets = await chApi.getExifByFolder(repo.id, id)
				let assets: AssetWithExif[]

				if (query && query !== '') {
					assets = await chApi.queryAssetsExif({
						folderId: id,
						repoId: repoId,
						query
					})
				} else {
					assets = await chApi.getExifByFolder(repoId, id)
				}

				const entries = assets.map((asset) =>
					convertToEntry(asset, params.metadataMap, {
						endpoint: endpoint,
						defaultHost: 'cdn.media.amplience.net'
					})
				)

				setEntries(entries)

				return entries
			}

			return []
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

		const handleResetZoom = () => {
			setZoom(1)
		}

		const handleMoveToTop = (media: MediaItem) => {
			const oldIndex = items.findIndex((item: MediaItem) => item.id === media.id)
			setItems(arrayMove(items, oldIndex, 0))
		}

		const handleMoveToBottom = (media: MediaItem) => {
			const oldIndex = items.findIndex((item: MediaItem) => item.id === media.id)
			setItems(arrayMove(items, oldIndex, items.length - 1))
		}

		/**
		 * Get an item from the collection
		 * @param id
		 */
		const getItem = (id: string) => {
			return items.find((item: MediaItem) => id === item.id)
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

		const handleContextMenu = (event: React.MouseEvent) => {
			setContextMedia(null)
			event.preventDefault()
			if (event.target instanceof HTMLElement) {
				if (event.target.id) {
					const filteredItems = items.filter(
						(element: MediaItem) => (event.target as HTMLElement).id === element.id
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
		 * Import new media in collection
		 */
		const importMedia = () => {
			if (pendingDefaultFolder) {
				setDefaultFolder(
					pendingDefaultFolder.repoId,
					pendingDefaultFolder.folderId,
					pendingDefaultFolder.query
				)
			}

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
					.filter((item: MediaItem) => item.selected)
					.map((item: MediaItem) => {
						item.selected = false
						item.disabled = false
						item.updated = false
						item.outOfSync = false
						return item
					})
				setItems(
					newItems
						// Update items in place
						.map((item: MediaItem) => {
							const match = newSelectedItems.find(
								(item2: MediaItem) => item.id === item2.id
							)
							if (match) {
								item = match
							}
							return item
						})
						// Add new items
						.concat(
							structuredClone(
								newSelectedItems.filter(
									(item: MediaItem) =>
										newItems.filter((item2: MediaItem) => item.id === item2.id)
											.length === 0
								)
							)
						)
				)
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
			setDetailDrawerOpen(false)
			tempMedia &&
				setItems((prevState: MediaItem[]) => {
					return prevState.map((item: MediaItem) => {
						if (item.id === tempMedia.id) {
							delete tempMedia.id
							item.entry = tempMedia
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
		 * Sort by Name asc
		 */
		const handleSortByNameAsc = () => {
			setItems((prevState: MediaItem[]) => {
				return prevState
					.slice()
					.sort((a: MediaItem, b: MediaItem) =>
						a.entry.photo.name > b.entry.photo.name
							? 1
							: b.entry.photo.name > a.entry.photo.name
							? -1
							: 0
					)
			})
			handleSortClose()
		}

		const handleSortByNameDesc = () => {
			setItems((prevState: MediaItem[]) => {
				return prevState
					.slice()
					.sort((a: MediaItem, b: MediaItem) =>
						b.entry.photo.name > a.entry.photo.name
							? 1
							: a.entry.photo.name > b.entry.photo.name
							? -1
							: 0
					)
			})
			handleSortClose()
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
		 * Sort by meta field asc
		 */
		const handleSortByMetaAsc = (key: string) => {
			setItems((prevState: MediaItem[]) => {
				return prevState.slice().sort((a: any, b: any) => {
					const aValue = a.entry[key] || 0
					const bValue = b.entry[key] || 0

					return aValue > bValue ? 1 : bValue > aValue ? -1 : 0
				})
			})
			handleSortClose()
		}

		/**
		 * Sort by meta field desc
		 */
		const handleSortByMetaDesc = (key: string) => {
			setItems((prevState: MediaItem[]) => {
				return prevState.slice().sort((a: any, b: any) => {
					const aValue = a.entry[key] || 0
					const bValue = b.entry[key] || 0

					return bValue > aValue ? 1 : aValue > bValue ? -1 : 0
				})
			})
			handleSortClose()
		}

		let state: AppContextData = {
			zoom,
			setZoom,
			items,
			setItems,
			initialItems,
			setInitialItems,
			importItems,
			setImportItems,
			gridMode,
			setGridMode,
			repos,
			setRepos,
			chApi,
			setChApi,
			detailDrawerOpen,
			setDetailDrawerOpen,
			importDrawerOpen,
			setImportDrawerOpen,
			sortAnchorEl,
			setSortAnchorEl,
			sortOpen,
			dragging,
			setDragging,
			fullscreenView,
			setFullscreenView,
			contextMedia,
			setContextMedia,
			currentMedia,
			setCurrentMedia,
			tempMedia,
			setTempMedia,
			snackOpen,
			setSnackOpen,
			infoPanelOpen,
			setInfoPanelOpen,
			currentAlert,
			setCurrentAlert,
			contextMenu,
			setContextMenu,
			//dragStart,
			//dragEnd,
			handleContextClose,
			handleContextMenu,
			handleDetailView,
			handleFullScreenView,
			handleImport,
			handleRemoveSelected,
			handleResetItems,
			handleSelectAll,
			handleSelectAllImportItems,
			handleSelectAllUpdatedImportItems,
			handleSelectAllOutOfSyncImportItems,
			handleSelectNone,
			handleSelectNoneImportItems,
			handleSnackClose,
			handleSnackOpen,
			handleSortByNameAsc,
			handleSortByNameDesc,
			handleSortByDateAsc,
			handleSortByDateDesc,
			handleSortClick,
			handleSortClose,
			handleZoomIn,
			handleZoomOut,
			handleResetZoom,
			handleSortByMetaAsc,
			handleSortByMetaDesc,
			handleMoveToTop,
			handleMoveToBottom,
			importMedia,
			getEntries,
			getItem,
			removeItem,
			selectImportItem,
			selectItem,
			saveItem,
			sensors,
			dragOrder,
			error,
			setError,
			entries
		}

		setState({ ...state })
		return () => {
			document.removeEventListener('keydown', keyDownHandler)
		}
	}, [
		zoom,
		items,
		importItems,
		gridMode,
		repos,
		chApi,
		detailDrawerOpen,
		importDrawerOpen,
		sortAnchorEl,
		sortOpen,
		dragging,
		fullscreenView,
		contextMedia,
		currentMedia,
		tempMedia,
		snackOpen,
		infoPanelOpen,
		currentAlert,
		contextMenu,
		configPath,
		field,
		setField,
		galleryPath,
		params,
		error,
		entries,
		pendingDefaultFolder,
		setPendingDefaultFolder
	])

	return <AppContext.Provider value={state}>{children}</AppContext.Provider>
}

export function useApp() {
	return useContext(AppContext)
}
