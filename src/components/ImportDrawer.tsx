import {
	CloseOutlined,
	GridViewSharp,
	GridViewOutlined,
	CheckBoxOutlined,
	CheckBoxOutlineBlank,
	VisibilityOutlined
} from '@mui/icons-material'
import {
	SwipeableDrawer,
	Stack,
	Typography,
	Box,
	IconButton,
	Divider,
	ImageList,
	ImageListItem,
	ImageListItemBar,
	Button,
	TextField,
	CircularProgress,
	Badge,
	Tooltip
} from '@mui/material'
import RichObjectTreeView from './RichTreeView'
import { AppContext } from '../app-context'
import { useContext, useEffect, useState } from 'react'
import { assetsToItems } from '../model/conversion'
import GenericImage from './GenericImage'
import { useExtension } from '../extension-context'
import { MediaItem } from '../model'
import _ from 'lodash'

const ImportDrawer = () => {
	const app = useContext(AppContext)
	const { params, field, oldConfig } = useExtension()

	const [queryValue, setQueryValue] = useState<string | undefined>(undefined)
	const [folderId, setFolderId] = useState<string | undefined>(undefined)
	const [loading, setLoading] = useState(false)

	let folder: string | undefined = undefined
	let query: string | undefined = undefined

	if (oldConfig) {
		folder = oldConfig.folderId
		query = oldConfig.query
	}

	useEffect(() => {
		setFolderId(folder)
		setQueryValue(query)
		console.log('fk ' + query)
	}, [folder, query])

	useEffect(() => {
		if (app.importDrawerOpen) {
			let cancelled = false

			;(async () => {
				if (app.getEntries && app.setImportItems && folderId) {
					setLoading(true)
					const entries = await app.getEntries(folderId, queryValue)
					if (!cancelled) {
						app.setImportItems(
							assetsToItems(entries, params).map((item: MediaItem) => {
								const filtered = app.items.filter(
									(item2: MediaItem) => item2.id === item.id
								)
								if (filtered.length > 0) {
									filtered.forEach((fItem: MediaItem) => {
										if (fItem.id === item.id) {
											if (_.isEqual(fItem, item)) {
												item.disabled = true
											} else {
												item.updated = true
											}
										}
									})
								}
								return item
							})
						)

						setLoading(false)
					}
				}
			})()

			return () => {
				cancelled = true
			}
		}

		// shouldn't rerun when app changes
	}, [queryValue, folderId, setLoading, params, app.importDrawerOpen])

	return (
		<SwipeableDrawer
			PaperProps={{
				sx: { width: '90%' }
			}}
			anchor={'left'}
			open={app.importDrawerOpen}
			onClose={() => {
				if (app.setImportDrawerOpen) app.setImportDrawerOpen(false)
			}}
			onOpen={() => {
				if (app.setImportDrawerOpen) app.setImportDrawerOpen(true)
			}}>
			<Stack spacing={2} sx={{ h: '100%', p: 0 }}>
				<Stack
					direction={'row'}
					sx={{
						position: 'sticky',
						top: 0,
						backgroundColor: 'white',
						zIndex: 100,
						p: 2
					}}>
					<Typography sx={{ pb: 2 }} variant='h5' component='h5'>
						Import Media
					</Typography>
					<Box sx={{ flexGrow: 1 }} />
					<Box>
						<IconButton
							aria-label={`close import drawer`}
							size='small'
							onClick={() => {
								if (app.setImportDrawerOpen) app.setImportDrawerOpen(false)
							}}>
							<CloseOutlined />
						</IconButton>
					</Box>
				</Stack>
				<Stack spacing={4} sx={{ p: 2, paddingTop: 0 }}>
					{/* Tree View */}
					{/* TODO: replace with a dropdown tree select */}
					{app.repo && (
						<RichObjectTreeView
							folders={app.repo?.folders}
							onChange={async (id: string) => {
								setFolderId(id)
							}}
							selectedId={folderId}
						/>
					)}
					<TextField
						key={query}
						label='Query'
						helperText='Query to filter assets in the folder with.'
						defaultValue={query}
						onChange={(event) => {
							setQueryValue(event.target.value)
						}}></TextField>
					<Divider />
					<Stack sx={{ w: '100%' }}>
						<Stack sx={{ pb: 4 }} direction={'row'}>
							<Box sx={{ flexGrow: 1 }} />
							<IconButton
								size='small'
								aria-label={`select all updated`}
								title='Select all updated'
								onClick={app.handleSelectAllUpdatedImportItems}>
								<Badge color='warning' variant='dot'>
									<GridViewSharp />
								</Badge>
							</IconButton>
							<IconButton
								size='small'
								aria-label={`select all`}
								title='Select all'
								onClick={app.handleSelectAllImportItems}>
								<GridViewSharp />
							</IconButton>
							<IconButton
								size='small'
								aria-label={`select none`}
								title='Select none'
								onClick={app.handleSelectNoneImportItems}>
								<GridViewOutlined />
							</IconButton>
						</Stack>

						{/* Import image list */}
						{/* TODO: move to flex wrap */}
						{loading ? (
							<div
								style={{
									height: '100px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center'
								}}>
								<CircularProgress />
							</div>
						) : (
							app.importItems && (
								<ImageList cols={5}>
									{app.importItems.map((item: MediaItem) => (
										<ImageListItem style={{ width: '200px' }}>
											<Box
												key={item.img}
												sx={{ mt: 1, ml: 1, mr: 1 }}
												style={{ position: 'relative' }}>
												<GenericImage
													item={item}
													w={150}
													disabled={item.disabled}
													zoomable={true}
													aspect={{ w: 3, h: 2 }}
													lazy={false}
													fillWidth={true}
												/>
												<IconButton
													size='small'
													sx={{
														color: 'white',
														position: 'absolute',
														top: 4,
														left: 4
													}}
													aria-label={`view fullscreen`}
													title='Click to zoom'
													onClick={() => app.handleFullScreenView(item)}>
													<VisibilityOutlined />
												</IconButton>
												<IconButton
													size='small'
													sx={{
														color: 'white',
														position: 'absolute',
														bottom: 4,
														left: 4
													}}
													aria-label={`select ${item.title}`}
													title='Select'
													disabled={item.disabled}
													onClick={() => {
														app.selectImportItem(item.id)
													}}>
													{item.selected ? (
														<CheckBoxOutlined />
													) : (
														<CheckBoxOutlineBlank />
													)}
												</IconButton>
											</Box>
											<ImageListItemBar
												title={
													<Tooltip title={item.title} followCursor={true}>
														<Typography variant='subtitle1' noWrap>
															{item.title}
														</Typography>
													</Tooltip>
												}
												subtitle={<span>by: {item.author}</span>}
												style={{
													color: `${
														item.disabled
															? '#bbb'
															: item.updated
															? 'orange'
															: '#000'
													}`
												}}
												position='below'
											/>
										</ImageListItem>
									))}
								</ImageList>
							)
						)}
					</Stack>
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
					<Button sx={{ mr: 2 }} variant='contained' onClick={app.importMedia}>
						Import
					</Button>
					<Button
						variant='outlined'
						onClick={() => {
							if (app.setImportDrawerOpen) app.setImportDrawerOpen(false)
						}}>
						Cancel
					</Button>
				</Stack>
			</Stack>
		</SwipeableDrawer>
	)
}

export default ImportDrawer
