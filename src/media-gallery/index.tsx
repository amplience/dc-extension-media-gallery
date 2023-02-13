import './media-gallery.css'

import { Box } from '@mui/material'
import ImageDialog from '../components/ImageDialog'
import AppToolbar from '../components/AppToolbar'
import GridView from '../components/GridView'
import ItemListView from '../components/ItemListView'
import DetailDrawer from '../components/DetailDrawer'
import MultiDetailDrawer from '../components/MultiDetailDrawer'
import ImportDrawer from '../components/ImportDrawer'
import AppSnack from '../components/AppSnack'
import ContextMenu from '../components/ContextMenu'
import { AppContext } from '../app-context'
import { useContext } from 'react'
import ImportAlert from '../components/ImportAlert'
import ErrorDialog from '../components/ErrorDialog'

function MediaGallery() {
	const app = useContext(AppContext)

	return (
		<>
			{/* Image full screen view */}
			<ImageDialog />

			{/* Main View */}
			<Box style={{ width: '100%' }}>
				{/* Toolbar */}
				<AppToolbar />

				{/* Import Alert Bar */}
				<ImportAlert />

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

				{/* Multi Image detail drawer */}
				<MultiDetailDrawer />

				{/* Import media drawer */}
				<ImportDrawer />
			</Box>
			<Box sx={{ width: '100%', flexGrow: 1 }} onContextMenu={app.handleContextMenu} />

			{/* Snack Bar for alerts */}
			<AppSnack />

			{/* Error Alert Dialog */}
			<ErrorDialog />
		</>
	)
}

export default MediaGallery
