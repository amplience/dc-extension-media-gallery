import { Snackbar, Alert } from '@mui/material'
import SlideTransition from './SlideTransition'

type SnackArgs = {
	snackOpen: boolean
	handleSnackClose: any
	currentAlert: any
}

const AppSnack = ({ snackOpen, handleSnackClose, currentAlert }: SnackArgs) => {
	return (
		<Snackbar
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'left'
			}}
			open={snackOpen}
			autoHideDuration={3000}
			onClose={handleSnackClose}
			TransitionComponent={SlideTransition}>
			<Alert
				onClose={handleSnackClose}
				severity={currentAlert?.severity}
				sx={{ width: '100%' }}>
				{currentAlert?.message}
			</Alert>
		</Snackbar>
	)
}

export default AppSnack
