import { AlertColor } from '@mui/material'

export interface MediaItem {
	id: number
	selected: boolean
	dateModified: string
	img: string
	title: string
	author: string
}

export interface AlertMessage {
	severity: AlertColor
	message: string
}
