import { Snackbar, Alert } from '@mui/material'
import SlideTransition from './SlideTransition'
import { useContext } from 'react'
import { AppContext } from '../app-context'

const AppSnack = () => {
	const app = useContext(AppContext)
	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'bottom',
				horizontal: 'right'
			}}
			open={app.snackOpen}
			autoHideDuration={3000}
			onClose={app.handleSnackClose}
			TransitionComponent={SlideTransition}>
			<Alert
				onClose={app.handleSnackClose}
				severity={app.currentAlert?.severity}
				sx={{ width: '100%' }}>
				{app.currentAlert?.message}
			</Alert>
		</Snackbar>
	)
}

export default AppSnack
