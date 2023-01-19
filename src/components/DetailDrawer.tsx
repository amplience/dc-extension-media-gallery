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
import GenericImage from './GenericImage'
import { useExtension } from '../extension-context'
import { map } from 'lodash'
import { MetadataMapEntry } from '../model/metadata-map'

const DetailDrawer = () => {
	const app = useContext(AppContext)

	const { params } = useExtension();

	const getIcon = (meta: MetadataMapEntry) => {
		switch (meta.icon) {
			case 'author':
				return <PhotoCameraFrontOutlined />
			case 'text':
				return <NotesOutlined />
			default:
				return <NotesOutlined />;
		}
	}

	const metaEdit = params.metadataMap.filter(meta => meta.visibility.indexOf('edit') !== -1).map(meta => {
		switch (meta.type) {
			case 'string':
				return (<TextField
					key={meta.target}
					id={meta.target}
					label={meta.label}
					variant='standard'
					defaultValue={app.currentMedia && app.currentMedia.entry[meta.target]}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								{getIcon(meta)}
							</InputAdornment>
						)
					}}
					onChange={(event) => {
						app.tempMedia && (app.tempMedia[meta.target] = event.target.value)
					}}
				/>)
			case 'multiline':
				return (<TextField
					key={meta.target}
					multiline
					rows={4}
					id='caption'
					label='Caption'
					variant='standard'
					defaultValue={app.currentMedia && app.currentMedia.entry[meta.target]}
					InputProps={{
						startAdornment: (
							<InputAdornment
								style={{ display: 'flex', flexDirection: 'column-reverse' }}
								position='start'>
								{getIcon(meta)}
							</InputAdornment>
						)
					}}
					onChange={(event) => {
						app.tempMedia && (app.tempMedia[meta.target] = event.target.value)
					}}
				/>)
			default:
				return <></>
		}
	});

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
				<Stack direction={'row'} sx={{position:'sticky', top:'-16px', backgroundColor:'white', zIndex:100, p:2}}>
					<Typography sx={{ pb: 0 }} variant='h5' component='h5'>
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
				<GenericImage item={app.currentMedia} w={1024} zoomable={true} aspect={{w:3,h:2}} lazy={false} fillWidth={true}></GenericImage>
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
				{metaEdit}
				</Stack>
				<Stack sx={{ pt: 2, pb: 4 }} direction={'row'}>
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
		</SwipeableDrawer>
	)
}

export default DetailDrawer
