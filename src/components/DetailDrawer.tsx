import {
	CloseOutlined,
	CalendarMonthOutlined,
	LockOutlined,
	PhotoCameraFrontOutlined,
	NotesOutlined
} from '@mui/icons-material'
import {
	SwipeableDrawer,
	Stack,
	Typography,
	Box,
	IconButton,
	TextField,
	InputAdornment,
	Button
} from '@mui/material'
import { AppContext } from '../app-context'
import { useContext } from 'react'

const DetailDrawer = () => {
	const app = useContext(AppContext)
	return (
		<SwipeableDrawer
			PaperProps={{
				sx: { width: '50%', p: 2 }
			}}
			anchor={'left'}
			open={app.detailDrawerOpen}
			onClose={() => {
				if (app.setDetailDrawerOpen) app.setDetailDrawerOpen(false)
			}}
			onOpen={() => {
				if (app.setDetailDrawerOpen) app.setDetailDrawerOpen(true)
			}}
			variant='temporary'
			ModalProps={{
				keepMounted: false
			}}>
			<Stack spacing={2} sx={{ h: '100%' }}>
				<Stack direction={'row'}>
					<Typography sx={{ pb: 2 }} variant='h5' component='h5'>
						Media Details
					</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<Box>
						<IconButton
							aria-label={`close detail drawer`}
							size='small'
							onClick={() => {
								if (app.setDetailDrawerOpen) app.setDetailDrawerOpen(false)
							}}>
							<CloseOutlined />
						</IconButton>
					</Box>
				</Stack>
				<img
					src={`${app.currentMedia?.img}?w=2048&h=1365&fit=crop&auto=format`}
					srcSet={`${app.currentMedia?.img}?w=2048&h=1365&fit=crop&auto=format&dpr=2 2x`}
					alt={app.currentMedia?.title}
					title='Click to zoom'
					onClick={() => {
						app.currentMedia && app.handleFullScreenView(app.currentMedia)
					}}
					loading='lazy'
				/>
				<TextField
					id='dateModified'
					label='Date modified'
					variant='standard'
					InputProps={{
						readOnly: true,
						startAdornment: (
							<InputAdornment position='start'>
								<CalendarMonthOutlined />
							</InputAdornment>
						),
						endAdornment: (
							<InputAdornment position='start'>
								<LockOutlined />
							</InputAdornment>
						)
					}}
					defaultValue={
						app.currentMedia?.dateModified &&
						new Date(app.currentMedia.dateModified).toLocaleString()
					}
				/>
				<TextField
					id='author'
					label='Author'
					variant='standard'
					defaultValue={app.currentMedia?.author}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<PhotoCameraFrontOutlined />
							</InputAdornment>
						)
					}}
					onChange={(event) => {
						app.tempMedia && (app.tempMedia.author = event.target.value)
					}}
				/>
				<TextField
					multiline
					rows={4}
					id='caption'
					label='Caption'
					variant='standard'
					defaultValue={app.currentMedia?.title}
					InputProps={{
						startAdornment: (
							<InputAdornment
								style={{ display: 'flex', flexDirection: 'column-reverse' }}
								position='start'>
								<NotesOutlined />
							</InputAdornment>
						)
					}}
					onChange={(event) => {
						app.tempMedia && (app.tempMedia.title = event.target.value)
					}}
				/>
				<Stack sx={{ pb: 4 }} direction={'row'}>
					<Box sx={{ flexGrow: 1 }} />
					<Button sx={{ mr: 2 }} variant='contained' onClick={app.saveItem}>
						Save
					</Button>
					<Button
						variant='outlined'
						onClick={() => {
							if (app.setDetailDrawerOpen) app.setDetailDrawerOpen(false)
						}}>
						Cancel
					</Button>
				</Stack>
			</Stack>
		</SwipeableDrawer>
	)
}

export default DetailDrawer
