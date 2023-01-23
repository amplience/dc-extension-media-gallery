import './media-gallery.css'

import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import ImageDialog from '../components/ImageDialog'
import AppToolbar from '../components/AppToolbar'
import GridView from '../components/GridView'
import ItemListView from '../components/ItemListView'
import DetailDrawer from '../components/DetailDrawer'
import ImportDrawer from '../components/ImportDrawer'
import AppSnack from '../components/AppSnack'
import ContextMenu from '../components/ContextMenu'
import { AppContext } from '../app-context'
import { useContext } from 'react'

const errorCodeToMessage = (code: string | undefined): string => {
	switch (code) {
		case 'client_id_invalid':
			return 'Couldn\'t authenticate with Content Hub: Client ID is invalid.\nMake sure it has been provided in the extension parameters.'
		case 'client_secret_invalid':
			return 'Couldn\'t authenticate with Content Hub: Client secret is invalid.\nMake sure you are using the proper secret for this client.'
		case undefined:
			return 'Unknown error.'
		default:
			return code
	}
}

function MediaGallery() {
	const app = useContext(AppContext)

	const handleClose = () => {
		app.setError(undefined);
	}

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

			<Dialog
				open={app.error != null}
				onClose={handleClose}
        		aria-describedby="error-dialog-description"
			>
				<DialogTitle>Fatal Error</DialogTitle>
				<DialogContent>
					<DialogContentText id="error-dialog-description">
						<Alert severity='error' sx={{marginBottom: '15px'}}>
							{errorCodeToMessage(app.error)}
						</Alert>
						Please check the documentation to ensure the extension has been configured correctly.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} autoFocus>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default MediaGallery
