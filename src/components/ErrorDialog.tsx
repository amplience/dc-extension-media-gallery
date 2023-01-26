import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle
} from '@mui/material'
import { useContext } from 'react'
import { AppContext } from '../app-context'

const errorCodeToMessage = (code: string | undefined): string => {
	switch (code) {
		case 'client_id_invalid':
			return "Couldn't authenticate with Content Hub: Client ID is invalid.\nMake sure it has been provided in the extension parameters."
		case 'client_secret_invalid':
			return "Couldn't authenticate with Content Hub: Client secret is invalid.\nMake sure you are using the proper secret for this client."
		case undefined:
			return 'Unknown error.'
		default:
			return code
	}
}

const ErrorDialog = () => {
	const app = useContext(AppContext)

	/**
	 * WHen the error Dialog is closed, this sets error to undefined
	 */
	const handleClose = () => {
		app.setError(undefined)
	}

	return (
		<Dialog
			open={app.error != null}
			onClose={handleClose}
			aria-describedby='error-dialog-description'>
			<DialogTitle>Error</DialogTitle>
			<DialogContent>
				<DialogContentText id='error-dialog-description'>
					<Alert severity='error' sx={{ marginBottom: '15px' }}>
						{errorCodeToMessage(app.error)}
					</Alert>
					Please check the documentation to ensure the extension has been configured
					correctly.
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleClose} autoFocus>
					OK
				</Button>
			</DialogActions>
		</Dialog>
	)
}

export default ErrorDialog
