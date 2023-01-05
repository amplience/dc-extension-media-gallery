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
import { EnrichedRepository, ChApi } from '../ch-api'
import credentials from '../credentials'
import { AlertMessage, MediaItem } from '../model'
import { convertToEntry, defaultExifMap } from '../model/conversion'
import Entry from '../model/entry'

const itemData: MediaItem[] = [
	{
		id: 1,
		selected: false,
		dateModified: '2022-12-21T20:15:20.379Z',
		img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
		title: 'Burger',
		author: '@rollelflex_graphy726'
	},
	{
		id: 2,
		selected: false,
		dateModified: '2022-11-20T19:25:20.379Z',
		img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
		title: 'Camera',
		author: '@helloimnik'
	},
	{
		id: 3,
		selected: false,
		dateModified: '2022-11-20T19:15:20.379Z',
		img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
		title: 'Coffee',
		author: '@nolanissac'
	},
	{
		id: 4,
		selected: false,
		dateModified: '2022-12-30T18:25:20.379Z',
		img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
		title: 'Hats',
		author: '@hjrc33'
	},
	{
		id: 5,
		selected: false,
		dateModified: '2022-11-20T19:35:20.379Z',
		img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
		title: 'Honey',
		author: '@arwinneil'
	},
	{
		id: 6,
		selected: false,
		dateModified: '2022-12-30T17:25:20.379Z',
		img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
		title: 'Basketball',
		author: '@tjdragotta'
	},
	{
		id: 7,
		selected: false,
		dateModified: '2022-11-20T19:45:20.379Z',
		img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
		title: 'Fern',
		author: '@katie_wasserman'
	},
	{
		id: 8,
		selected: false,
		dateModified: '2022-12-30T16:25:20.379Z',
		img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
		title: 'Mushrooms',
		author: '@silverdalex'
	},
	{
		id: 9,
		selected: false,
		dateModified: '2022-12-21T20:15:20.379Z',
		img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
		title: 'Tomato basil',
		author: '@shelleypauls'
	},
	{
		id: 10,
		selected: false,
		dateModified: '2022-12-30T15:25:20.379Z',
		img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
		title: 'Sea star',
		author: '@peterlaster'
	},
	{
		id: 11,
		selected: false,
		dateModified: '2022-12-30T14:25:20.379Z',
		img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
		title: 'Bike',
		author: '@southside_customs'
	},
	{
		id: 12,
		selected: false,
		dateModified: '2022-12-21T20:15:20.379Z',
		img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
		title: 'Breakfast',
		author: '@bkristastucchio'
	},
	{
		id: 13,
		selected: false,
		dateModified: '2021-12-30T13:25:20.379Z',
		img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3',
		title: 'Concert crowd',
		author: '@silverdalex'
	},
	{
		id: 14,
		selected: false,
		dateModified: '2021-11-20T12:15:20.379Z',
		img: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec',
		title: 'Crowd love',
		author: '@silverdalex'
	}
]

type AppContextData = {
	zoom: number
	setZoom?: Dispatch<SetStateAction<number>>
	items: MediaItem[]
	setItems?: Dispatch<SetStateAction<MediaItem[]>>
	importItems?: MediaItem[] | null
	setImportItems?: Dispatch<SetStateAction<MediaItem[]>>
	gridMode?: boolean
	setGridMode?: Dispatch<SetStateAction<boolean>>
	repo?: EnrichedRepository | null
	setRepo?: Dispatch<SetStateAction<EnrichedRepository | undefined>>
	chApi?: any
	setChApi?: Dispatch<SetStateAction<ChApi | undefined>>
	detailDrawerOpen?: boolean
	setDetailDrawerOpen?: Dispatch<SetStateAction<boolean>>
	importDrawerOpen?: boolean
	setImportDrawerOpen?: Dispatch<SetStateAction<boolean>>
	sortAnchorEl?: HTMLElement | null
	setSortAnchorEl?: Dispatch<SetStateAction<HTMLElement | null>>
	sortOpen: boolean
	dragging?: boolean
	setDragging?: Dispatch<SetStateAction<boolean>>
	fullscreenView?: boolean
	setFullscreenView?: Dispatch<SetStateAction<boolean>>
	contextMedia?: MediaItem | null
	setContextMedia?: Dispatch<SetStateAction<MediaItem | null>>
	currentMedia?: MediaItem | null
	setCurrentMedia?: Dispatch<SetStateAction<MediaItem | null>>
	tempMedia?: MediaItem | null
	setTempMedia?: Dispatch<SetStateAction<MediaItem | null>>
	snackOpen?: boolean
	setSnackOpen?: Dispatch<SetStateAction<boolean>>
	infoPanelOpen?: boolean
	setInfoPanelOpen?: Dispatch<SetStateAction<boolean>>
	currentAlert?: AlertMessage | null
	setCurrentAlert?: Dispatch<SetStateAction<AlertMessage | null>>
	contextMenu?: { mouseX: number; mouseY: number } | null
	setContextMenu?: Dispatch<SetStateAction<{ mouseX: number; mouseY: number } | null>>
	dragStart?: (event: any) => void
	dragEnd?: (event: any) => void
	handleContextClose?: (event: React.MouseEvent) => void
	handleContextMenu: (event: React.MouseEvent) => void
	handleDetailView: (media: MediaItem) => void
	handleFullScreenView: (media: MediaItem) => void
	handleImport?: () => void
	handleRemoveSelected?: () => void
	handleResetItems?: () => void
	handleSelectAll?: () => void
	handleSelectAllImportItems?: () => void
	handleSelectNone?: () => void
	handleSelectNoneImportItems?: () => void
	handleSnackClose?: () => void
	handleSnackOpen?: () => void
	handleSortByCaptionAsc?: () => void
	handleSortByCaptionDesc?: () => void
	handleSortByDateAsc?: () => void
	handleSortByDateDesc?: () => void
	handleSortClick?: (event: React.MouseEvent<HTMLElement>) => void
	handleSortClose?: () => void
	handleZoomIn?: () => void
	handleZoomOut?: () => void
	handleSortByAuthorAsc?: () => void
	handleSortByAuthorDesc?: () => void
	importMedia?: () => void
	sensors?: SensorDescriptor<SensorOptions>[]
	getEntries?: (id: string) => Promise<Entry[]>
	getItem?: (id: number) => MediaItem | undefined
	removeItem: (id: number) => void
	selectImportItem?: (id: number) => void
	selectItem: (id: number) => void
	saveItem?: () => void
}

const appDefaultState = {
	sortOpen: false,
	zoom: 1,
	items: [],
	handleDetailView: (media: MediaItem) => {},
	handleFullScreenView: (media: MediaItem) => {},
	selectItem: (id: number) => {},
	removeItem: (id: number) => {},
	handleContextMenu: (event: React.MouseEvent) => {}
}

export const AppContext = React.createContext<AppContextData>(appDefaultState)

export function AppContextProvider({ children }: { children: ReactNode }) {
	const [state, setState] = useState<AppContextData>(appDefaultState)
	const [zoom, setZoom] = useState(1)
	const [items, setItems] = useState<MediaItem[]>(structuredClone(itemData))
	const [importItems, setImportItems] = useState<MediaItem[]>(structuredClone(itemData))
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

		/**
		 * Getting assets from Content Hub
		 * @param id
		 */
		const getEntries = async (id: string): Promise<Entry[]> => {
			if (chApi && repo) {
				const assets = await chApi.getExifByFolder(repo.id, id)

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
			setItems(structuredClone(itemData))
			setCurrentAlert({
				severity: 'success',
				message: 'Collection reset successfully!'
			})
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
						if (item.id === tempMedia.id) item = tempMedia
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
			dragStart,
			dragEnd,
			handleContextClose,
			handleContextMenu,
			handleDetailView,
			handleFullScreenView,
			handleImport,
			handleRemoveSelected,
			handleResetItems,
			handleSelectAll,
			handleSelectAllImportItems,
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
			importMedia,
			sensors,
			getEntries,
			getItem,
			removeItem,
			selectImportItem,
			selectItem,
			saveItem
		}

		setState({ ...state })
		return () => {
			document.removeEventListener('keydown', keyDownHandler)
		}
	}, [
		chApi,
		contextMedia,
		contextMenu,
		currentAlert,
		currentMedia,
		detailDrawerOpen,
		dragging,
		fullscreenView,
		gridMode,
		importDrawerOpen,
		importItems,
		infoPanelOpen,
		items,
		repo,
		sensors,
		setChApi,
		snackOpen,
		sortAnchorEl,
		sortOpen,
		tempMedia,
		zoom
	])

	return <AppContext.Provider value={state}>{children}</AppContext.Provider>
}

export function useExtension() {
	return useContext(AppContext)
}
