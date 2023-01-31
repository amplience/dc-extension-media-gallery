import { AlertColor } from '@mui/material'
import Entry from './entry'

/**
 * Media item wrapper for the UI. Contains state for the item, a friendly
 * image url and the entry that's saved into the content item.
 */
export interface MediaItem {
	id: string
	selected: boolean
	disabled: boolean
	updated: boolean
	outOfSync: boolean
	dateModified: string
	img: string
	entry: Entry
}

/**
 * Alert messaage for the UI.
 */
export interface AlertMessage {
	severity: AlertColor
	message: string
}
