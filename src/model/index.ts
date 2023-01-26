import { AlertColor } from '@mui/material'
import Entry from './entry'

/**
 * TODO: javadoc
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
 * 
 */
export interface AlertMessage {
	severity: AlertColor
	message: string
}
