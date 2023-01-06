import './media-gallery.css'

import { useContext } from 'react'
import { Box } from '@mui/material'

import ImageDialog from '../components/ImageDialog'
import AppToolbar from '../components/AppToolbar'
import GridView from '../components/GridView'
import ItemListView from '../components/ItemListView'
import DetailDrawer from '../components/DetailDrawer'
import ImportDrawer from '../components/ImportDrawer'
import AppSnack from '../components/AppSnack'
import ContextMenu from '../components/ContextMenu'
import { AppContext } from '../app-context'

function MediaGallery() {
	const app = useContext(AppContext)
	return (
		<>
			{/* Image full screen view */}
			{/* TODO: mode styles for all components */}
			<ImageDialog />
			<Box style={{ width: '100%' }}>
				{/* Toolbar */}
				<AppToolbar />

				{/* Context Menu */}
				<ContextMenu />

				{/* Main view */}
				<Box sx={{ w: '100%', pr: 2, pl: 2 }} onContextMenu={app.handleContextMenu}>
					{app.gridMode ? (
						// Grid view
						<GridView />
					) : (
						// List view
						<ItemListView />
					)}
				</Box>

				{/* Image detail drawer */}
				<DetailDrawer />

				{/* Import media drawer */}
				{/* TODO: move to components */}
				<ImportDrawer />
			</Box>
			<Box sx={{ width: '100%', flexGrow: 1 }} onContextMenu={app.handleContextMenu} />

			{/* Snack Bar for alerts */}
			<AppSnack />
		</>
	)
}

export default MediaGallery
