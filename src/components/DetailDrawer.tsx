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
import { MediaItem } from '../model'

type DetailDrawerArgs = {
	currentMedia: MediaItem | null
	detailDrawerOpen: boolean
	setDetailDrawerOpen: any
	handleFullScreenView: any
	tempMedia: MediaItem | null
	saveItem: any
}

const DetailDrawer = ({
	currentMedia,
	detailDrawerOpen,
	setDetailDrawerOpen,
	handleFullScreenView,
	tempMedia,
	saveItem
}: DetailDrawerArgs) => {
	return (
		<SwipeableDrawer
			PaperProps={{
				sx: { width: '50%', p: 2 }
			}}
			anchor={'left'}
			open={detailDrawerOpen}
			onClose={() => setDetailDrawerOpen(false)}
			onOpen={() => setDetailDrawerOpen(true)}
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
							onClick={() => setDetailDrawerOpen(false)}>
							<CloseOutlined />
						</IconButton>
					</Box>
				</Stack>
				<img
					src={`${currentMedia?.img}?w=1024&h=683&sm=clamp&fmt=auto&qlt=75&fmt.jpeg.interlaced=true`}
					srcSet={`${currentMedia?.img}?w=2048&h=1366&sm=clamp&fmt=auto&qlt=75&fmt.jpeg.interlaced=true 2x`}
					alt={currentMedia?.title}
					title='Click to zoom'
					onClick={() => {
						currentMedia && handleFullScreenView(currentMedia)
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
						currentMedia?.dateModified &&
						new Date(currentMedia.dateModified).toLocaleString()
					}
				/>
				<TextField
					id='author'
					label='Author'
					variant='standard'
					defaultValue={currentMedia?.author}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<PhotoCameraFrontOutlined />
							</InputAdornment>
						)
					}}
					onChange={(event) => {
						tempMedia && (tempMedia.author = event.target.value)
					}}
				/>
				<TextField
					multiline
					rows={4}
					id='caption'
					label='Caption'
					variant='standard'
					defaultValue={currentMedia?.title}
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
						tempMedia && (tempMedia.title = event.target.value)
					}}
				/>
				<Stack sx={{ pb: 4 }} direction={'row'}>
					<Box sx={{ flexGrow: 1 }} />
					<Button sx={{ mr: 2 }} variant='contained' onClick={saveItem}>
						Save
					</Button>
					<Button variant='outlined' onClick={() => setDetailDrawerOpen(false)}>
						Cancel
					</Button>
				</Stack>
			</Stack>
		</SwipeableDrawer>
	)
}

export default DetailDrawer
