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
import { AssetWithExif, EnrichedRepository } from '../ch-api/shared'

type AppContextData = {
	zoom: number
	setZoom?: Dispatch<SetStateAction<number>>
	items: MediaItem[]
	setItems?: Dispatch<SetStateAction<MediaItem[]>>
	importItems: MediaItem[] | null
	setImportItems?: Dispatch<SetStateAction<MediaItem[]>>
	gridMode: boolean
	setGridMode?: Dispatch<SetStateAction<boolean>>
	repo?: EnrichedRepository | null
	setRepo?: Dispatch<SetStateAction<EnrichedRepository | undefined>>
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
	tempMedia?: MediaItem | null
	setTempMedia?: Dispatch<SetStateAction<MediaItem | null>>
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
	handleSelectNone: () => void
	handleSelectNoneImportItems: () => void
	handleSnackClose: () => void
	handleSnackOpen: () => void
	handleSortByCaptionAsc: () => void
	handleSortByCaptionDesc: () => void
	handleSortByDateAsc: () => void
	handleSortByDateDesc: () => void
	handleSortClick: (event: React.MouseEvent<HTMLElement>) => void
	handleSortClose: () => void
	handleZoomIn: () => void
	handleZoomOut: () => void
	handleSortByAuthorAsc: () => void
	handleSortByAuthorDesc: () => void
	handleMoveToTop: (media: MediaItem) => void
	handleMoveToBottom: (media: MediaItem) => void
	importMedia: () => void
	sensors?: SensorDescriptor<SensorOptions>[]
	getEntries?: (id: string, query?: string) => Promise<Entry[]>
	getItem?: (id: string) => MediaItem | undefined
	removeItem: (id: string) => void
	selectImportItem: (id: string) => void
	selectItem: (id: string) => void
	saveItem?: () => void
	dragOrder: (active: any, over: any) => void
}

const defaultAppState = {
	zoom: 1,
	items: [],
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
	handleSelectNoneImportItems: () => {},
	handleSnackClose: () => {},
	handleSnackOpen: () => {},
	handleSortByCaptionAsc: () => {},
	handleSortByCaptionDesc: () => {},
	handleSortByDateAsc: () => {},
	handleSortByDateDesc: () => {},
	handleSortClick: (event: React.MouseEvent<HTMLElement>) => {},
	handleSortClose: () => {},
	handleZoomIn: () => {},
	handleZoomOut: () => {},
	handleSortByAuthorAsc: () => {},
	handleSortByAuthorDesc: () => {},
	handleMoveToTop: () => {},
	handleMoveToBottom: () => {},
	importMedia: () => {},
	selectImportItem: (id: string) => {},
	dragOrder: (active: any, over: any) => {}
}

export const AppContext = React.createContext<AppContextData>(defaultAppState)

export function AppContextProvider({ children }: { children: ReactNode }) {
	const { field, setField, params, sdk } = useExtension()
	const { galleryPath, configPath } = params

	const [state, setState] = useState<AppContextData>(defaultAppState)
	const [zoom, setZoom] = useState(1)
	const [dragging, setDragging] = useState(false)
	const [items, setItems] = useState<MediaItem[]>([])
	const [importItems, setImportItems] = useState<MediaItem[]>([])
	const [gridMode, setGridMode] = useState(true)
	const [repo, setRepo] = useState<EnrichedRepository>()
	const [chApi, setChApi] = useState<IChApi>()
	const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
	const [importDrawerOpen, setImportDrawerOpen] = useState(false)
	const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
	const sortOpen = Boolean(sortAnchorEl)
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

				await api.auth(params.clientId, params.clientSecret)
				setChApi(api)

				const result = await api.allReposWithFolders()
				console.log(result)
				setRepo(result[0])
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
		const getEntries = async (id: string, query?: string): Promise<Entry[]> => {
			if (chApi && repo) {
				setDefaultFolder(repo.id, id, query)
				//const assets = await chApi.getExifByFolder(repo.id, id)
				let assets: AssetWithExif[]

				if (query && query !== '') {
					assets = await chApi.queryAssetsExif({
						folderId: id,
						repoId: repo.id,
						query
					})
				} else {
					assets = await chApi.getExifByFolder(repo.id, id)
				}

				const entries = assets.map((asset) =>
					convertToEntry(asset, params.exifMap, {
						endpoint: 'nmrsaalphatest',
						defaultHost: 'cdn.media.amplience.net'
					})
				)

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
						return item
					})
				setTimeout(() => {
					setItems(
						newItems
							// filtering out existing items, so updated items can be added
							// TODO: replace existing items
							.filter(
								(item: MediaItem) =>
									newSelectedItems.filter((item2) => item.id === item2.id)
										.length === 0
							)
							.concat(structuredClone(newSelectedItems))
					)
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
							tempMedia.entry[params.displayDescription] = tempMedia.title
							tempMedia.entry[params.displayAuthor] = tempMedia.author
							item = tempMedia
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
					.sort((a: any, b: any) =>
						a.author > b.author ? 1 : b.author > a.author ? -1 : 0
					)
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
					.sort((a: any, b: any) =>
						b.author > a.author ? 1 : a.author > b.author ? -1 : 0
					)
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

		let state: AppContextData = {
			zoom,
			setZoom,
			items,
			setItems,
			importItems,
			setImportItems,
			gridMode,
			setGridMode,
			repo,
			setRepo,
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
			handleSelectNone,
			handleSelectNoneImportItems,
			handleSnackClose,
			handleSnackOpen,
			handleSortByCaptionAsc,
			handleSortByCaptionDesc,
			handleSortByDateAsc,
			handleSortByDateDesc,
			handleSortClick,
			handleSortClose,
			handleZoomIn,
			handleZoomOut,
			handleSortByAuthorAsc,
			handleSortByAuthorDesc,
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
			dragOrder
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
		repo,
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
		params
	])

	return <AppContext.Provider value={state}>{children}</AppContext.Provider>
}

export function useApp() {
	return useContext(AppContext)
}
