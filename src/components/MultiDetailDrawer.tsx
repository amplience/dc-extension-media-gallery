import {
	CloseOutlined,
	CalendarMonthOutlined,
	LockOutlined,
	PhotoCameraFrontOutlined,
	NotesOutlined,
	CheckBox
} from '@mui/icons-material'
import {
	SwipeableDrawer,
	Stack,
	Typography,
	Box,
	IconButton,
	TextField,
	InputAdornment,
	Button,
	List,
	ListItem,
	ListItemText,
	ListItemIcon,
	Paper,
	FormGroup,
	FormControlLabel,
	Checkbox
} from '@mui/material'
import { AppContext } from '../app-context'
import { useContext, useReducer, useState } from 'react'
import { useExtension } from '../extension-context'
import { MetadataMapEntry } from '../model/metadata-map'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { MediaItem } from '../model'
import GenericImage from './GenericImage'

const generateEmptyEntry = () => {
	return {
		photo: {
			_meta: {
				schema: 'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link'
			},
			id: '',
			name: '',
			endpoint: '',
			defaultHost: ''
		},
		date: ''
	} as any
}

/**
 * A drawer that shows details for a media item, and allows fields to be edited.
 * @returns DetailDrawer Component
 */
const MultiDetailDrawer = () => {
	const app = useContext(AppContext)
	const { params } = useExtension()
	const selectedItems = app.items?.filter((item: MediaItem) => item.selected)
	const [dateValid, setDateValid] = useState(true)
	const [tempMedia, setTempMedia] = useState({
		photo: {
			_meta: {
				schema: 'http://bigcontent.io/cms/schema/v1/core#/definitions/image-link'
			},
			id: '',
			name: '',
			endpoint: '',
			defaultHost: ''
		},
		date: ''
	} as any)
	const [, forceUpdate] = useReducer(x => x + 1, 0);

	/**
	 * Returns a MUI Icon based on meta.icon value. 'author' returns <PhotoCameraFrontOutlined /> all else returns <NotesOutlined />
	 * @param meta
	 * @returns MUI Icon
	 */
	const getIcon = (meta: MetadataMapEntry) => {
		switch (meta.icon) {
			case 'author':
				return <PhotoCameraFrontOutlined />
			case 'text':
				return <NotesOutlined />
			default:
				return <NotesOutlined />
		}
	}

	/**
	 * Checks if all the elements in a string array are identical
	 * @param arr 
	 * @returns Boolean
	 */
	function allIdentical(arr: string[]) {
		for (var i = 1; i < arr.length; i++) {
			if (arr[i] !== arr[0]) {
				return false;
			}
		}
		return true;
	}

	const metaEdit: any = params.metadataMap
		.filter((meta: any) => meta.visibility.indexOf('edit') !== -1)
		.map((meta: any) => {
			switch (meta.type) {
				case 'string':
					return (
						<>
							<Stack direction={'row'} gap={2}>
								<TextField
									sx={{ width: '100%' }}
									key={meta.target}
									id={meta.target}
									label={meta.label}
									variant='standard'
									disabled={tempMedia[meta.target + '_$clear$']}
									defaultValue={allIdentical(selectedItems.map((item: MediaItem) => {
										return item.entry[meta.target]
									})) ? selectedItems[0]?.entry[meta.target] : ''}
									placeholder={!allIdentical(selectedItems.map((item: MediaItem) => {
										return item.entry[meta.target]
									})) ? 'Multiple values' : ''}
									InputProps={{
										startAdornment: (
											<InputAdornment position='start'>
												{getIcon(meta)}
											</InputAdornment>
										),
										readOnly: !meta.editable
									}}
									onChange={(event) => {
										tempMedia[meta.target] = event.target.value
									}}
								/>
								<FormGroup>
									<FormControlLabel
										sx={{ width: '120px' }}
										control={<Checkbox value={tempMedia[meta.target + '_$clear$']} size={'small'} />}
										onClick={() => {
											setTempMedia((prev: any) => {
												prev[meta.target + '_$clear$'] = !prev[meta.target + '_$clear$']
												return prev
											})
											forceUpdate()
										}}
										label="Clear" />
								</FormGroup>
							</Stack>
						</>
					)
				case 'multiline':
					return (
						<>
							<Stack direction={'row'} gap={2}>
								<TextField
									sx={{ width: '100%' }}
									key={meta.target}
									multiline
									rows={4}
									id={meta.target}
									label={meta.label}
									variant='standard'
									disabled={tempMedia[meta.target + '_$clear$']}
									defaultValue={allIdentical(selectedItems.map((item: MediaItem) => {
										return item.entry[meta.target]
									})) ? selectedItems[0]?.entry[meta.target] : ''}
									placeholder={!allIdentical(selectedItems.map((item: MediaItem) => {
										return item.entry[meta.target]
									})) ? 'Multiple values' : ''}
									InputProps={{
										startAdornment: (
											<InputAdornment
												style={{ display: 'flex', flexDirection: 'column-reverse' }}
												position='start'>
												{getIcon(meta)}
											</InputAdornment>
										),
										readOnly: !meta.editable
									}}
									onChange={(event) => {
										tempMedia[meta.target] = event.target.value
									}}
								/>
								<FormGroup>
									<FormControlLabel
										sx={{ width: '120px' }}
										control={<Checkbox value={tempMedia[meta.target + '_$clear$']} size={'small'} />}
										onClick={() => {
											setTempMedia((prev: any) => {
												prev[meta.target + '_$clear$'] = !prev[meta.target + '_$clear$']
												return prev
											})
											forceUpdate()
										}}
										label="Clear" />
								</FormGroup>
							</Stack>
						</>
					)
				case 'date':
					const value = tempMedia[meta.target] ?? (allIdentical(selectedItems.map((item: MediaItem) => {
						return item.entry[meta.target]
					})) ? selectedItems[0]?.entry[meta.target] : null)

					const placeholder = tempMedia[meta.target] != null || !allIdentical(selectedItems.map((item: MediaItem) => {
						return item.entry[meta.target]
					})) ? ' (multiple values)' : ''

					if (meta.editable) {
						return (
							<>
								<Stack direction={'row'} gap={2}>
									<DateTimePicker
										key={meta.target}
										label={meta.label + placeholder}
										value={value == null ? null : value * 1000}
										disabled={tempMedia[meta.target + '_$clear$']}
										renderInput={(params) => <TextField {...params} sx={{ width: '100%' }} />}
										onChange={(event: any) => {
											if (event !== null &&
												event.$d && isNaN(event.$d.getTime())) {
												setDateValid(false)
											} else {
												setDateValid(true)
											}
											event !== null &&
												event.$d &&
												(event.$d !== 'Invalid Date') &&
												(tempMedia[meta.target] = event.$d.getTime() / 1000)
												forceUpdate()
										}}
									/>
									<FormGroup>
										<FormControlLabel
											sx={{ width: '120px' }}
											control={<Checkbox value={tempMedia[meta.target + '_$clear$']} size={'small'} />}
											onClick={() => {
												setTempMedia((prev: any) => {
													prev[meta.target + '_$clear$'] = !prev[meta.target + '_$clear$']
													return prev
												})
												forceUpdate()
											}}
											label="Clear" />
									</FormGroup>
								</Stack>
							</>
						)
					} else {
						return (
							<TextField
								key={meta.target}
								label={meta.label}
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
								defaultValue={value && new Date(value * 1000).toLocaleString()}
							/>
						)
					}
				default:
					return <></>
			}
		})

	return (
		<SwipeableDrawer
			PaperProps={{
				sx: { width: '50%', p: 2 }
			}}
			anchor={'left'}
			open={app.multiDetailDrawerOpen}
			onClose={() => {
				if (app.setMultiDetailDrawerOpen) app.setMultiDetailDrawerOpen(false)
				setTempMedia(generateEmptyEntry())
			}}
			onOpen={() => {
				if (app.setMultiDetailDrawerOpen) app.setMultiDetailDrawerOpen(true)
			}}
			variant='temporary'
			ModalProps={{
				keepMounted: false
			}}>
			<Stack spacing={2} sx={{ h: '100%' }}>
				<Stack
					direction={'row'}
					sx={{
						position: 'sticky',
						top: '-16px',
						backgroundColor: 'white',
						zIndex: 100,
						p: 0
					}}>
					<Typography sx={{ pb: 0 }} variant='h5' component='h5'>
						Multiple Media Details
					</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<Box>
						<IconButton
							aria-label={`close detail drawer`}
							size='small'
							onClick={() => {
								if (app.setMultiDetailDrawerOpen) app.setMultiDetailDrawerOpen(false)
							}}>
							<CloseOutlined />
						</IconButton>
					</Box>
				</Stack>
				{
					selectedItems &&
					<>
						<Typography variant='subtitle1'>{selectedItems.length} selected item{selectedItems.length > 1 && 's'}</Typography>
						<Paper style={{ maxHeight: 250, overflow: 'auto' }}>
							<List>
								{
									selectedItems.map((item: MediaItem) => {
										return (
											<ListItem>
												<ListItemIcon>
													<GenericImage
														item={item}
														w={32}
														zoomable={true}
														aspect={{ w: 3, h: 2 }}
														lazy={false}
														fillWidth={true}></GenericImage>
												</ListItemIcon>
												<ListItemText primary={item?.entry?.photo?.name} />
											</ListItem>
										)
									})
								}
							</List>
						</Paper>
					</>
				}
				<TextField
					id='name'
					label='Name'
					variant='standard'
					InputProps={{
						readOnly: true,
						startAdornment: (
							<InputAdornment position='start'>
								<NotesOutlined />
							</InputAdornment>
						),
						endAdornment: (
							<InputAdornment position='start'>
								<LockOutlined />
							</InputAdornment>
						)
					}}
					defaultValue={selectedItems.length > 1 ? 'Multiple values' : selectedItems[0]?.entry?.photo?.name}
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
					defaultValue={selectedItems.length > 1 ? 'Multiple values' : new Date(selectedItems[0]?.dateModified).toLocaleString()}
				/>
				{metaEdit}
			</Stack>
			<Stack
				sx={{
					pb: 4,
					pt: 2,
					p: 2,
					position: 'sticky',
					backgroundColor: 'white',
					bottom: 0
				}}
				direction={'row'}>
				<Box sx={{ flexGrow: 1 }} />
				<Button
					disabled={!dateValid}
					sx={{ mr: 2 }}
					variant='contained'
					onClick={() => {
						if (app.saveItems) {
							app.saveItems(tempMedia)
						}
						setTempMedia(generateEmptyEntry())
					}}>
					Save
				</Button>
				<Button
					variant='outlined'
					onClick={() => {
						if (app.setMultiDetailDrawerOpen) app.setMultiDetailDrawerOpen(false)
						setTempMedia(generateEmptyEntry())
					}}>
					Cancel
				</Button>
			</Stack>
		</SwipeableDrawer>
	)
}

export default MultiDetailDrawer
