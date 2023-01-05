import { AlertColor } from '@mui/material'
import Entry from './entry'

export interface MediaItem {
	id: number
	selected: boolean
	dateModified: string
	img: string
	title: string
	author: string
	entry: Entry;
}

export interface AlertMessage {
	severity: AlertColor
	message: string
}
