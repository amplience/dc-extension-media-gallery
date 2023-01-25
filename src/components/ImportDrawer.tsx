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
	Tooltip,
	Alert
} from '@mui/material'
import RichObjectTreeView from './RichTreeView'
import { AppContext } from '../app-context'
import { useContext, useEffect, useState } from 'react'
import { assetsToItems } from '../model/conversion'
import GenericImage from './GenericImage'
import { useExtension } from '../extension-context'
import { MediaItem } from '../model'
import _ from 'lodash'
import { EnrichedRepository, Folder } from '../ch-api/shared'
import { metaToString } from '../model/metadata-map'

const containsFolder = (folders: Folder[] | undefined, id: string): boolean => {
  if (folders) {
    for (let folder of folders) {
      if (folder.id === id || containsFolder(folder.children, id)) {
        return true;
      }
    }
  }

  return false;
}

const getRepoId = (repos: EnrichedRepository[], id: string): string | undefined => {
  for (let repo of repos) {
    if (repo.id === id || containsFolder(repo.folders, id)) {
      return repo.id;
    }
  }

  return undefined;
}

const ImportDrawer = () => {
	const app = useContext(AppContext)
	const { params, field, oldConfig } = useExtension()

	const [queryValue, setQueryValue] = useState<string | undefined>(undefined)
	const [repoId, setRepoId] = useState<string | undefined>(undefined)
	const [folderId, setFolderId] = useState<string | undefined>(undefined)
	const [loading, setLoading] = useState(false)
	const [isEmpty, setIsEmpty] = useState(false)

  let repo: string | undefined = undefined;
	let folder: string | undefined = undefined
	let query: string | undefined = undefined


	if (oldConfig) {
    repo = oldConfig.repoId
		folder = oldConfig.folderId
		query = oldConfig.query
	}

	useEffect(() => {
    setRepoId(repo)
		setFolderId(folder)
		setQueryValue(query)
	}, [repo, folder, query])

	useEffect(() => {
		if (app.importDrawerOpen) {
			let cancelled = false

			;(async () => {
				if (app.getEntries && app.setImportItems && repoId && folderId) {
					setLoading(true)
          setIsEmpty(false)
					const entries = await app.getEntries(repoId, folderId === repoId ? 'root' : folderId, queryValue)
					if (!cancelled) {
            setIsEmpty(entries.length === 0);
						app.setImportItems(
							assetsToItems(entries, params).map((item: MediaItem) => {
								const filtered = app.items.filter(
									(item2: MediaItem) => item2.id === item.id
								)
								if (filtered.length > 0) {
									filtered.forEach((fItem: MediaItem) => {
										if (fItem.id === item.id) {
                      if (fItem.dateModified < item.dateModified) {
                        item.updated = true
                      } else if (!(_.isEqual(fItem.entry, item.entry))) {
                        item.outOfSync = true
                      } else {
                        item.disabled = true
                      }
										}
                  })
								}
								return item
							}))

							setLoading(false)
						}
					}
				})()

			return () => {
				cancelled = true
			}
		}

		// shouldn't rerun when app changes
	}, [queryValue, folderId, repoId, setLoading, params, app.importDrawerOpen])

	return (
		<SwipeableDrawer
			PaperProps={{
				sx: { width: '90%',  overflowX: 'clip', overflowY: 'auto' }
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
						p: 1
					}}>
					<Typography sx={{ pb: 2 }} variant='h5' component='h5'>
						Import Media
					</Typography>
					<Box style={{ flexGrow: 1 }} />
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
				<Stack spacing={4} sx={{ p: 0, paddingTop: 0 }}>
					<Stack
						direction={'row'}
						spacing={2}
						sx={{
							position: 'sticky',
							top: 50,
							backgroundColor: 'white',
							zIndex: 100,
							p: 1
						}
						}>
						{/* Tree View */}
						{/* TODO: replace with a dropdown tree select */}
						{app.repos && (
							<Box style={{ width: '40%' }}>
								<RichObjectTreeView
									folders={app.repos}
									onChange={async (id: string) => {
                    const repoId = getRepoId(app.repos as EnrichedRepository[], id)

                    setRepoId(repoId)
                    setFolderId(id)
									}}
									selectedId={folderId}
								/>
							</Box>
						)}
						<TextField
							key={query}
							style={{ width: '30%' }}
							size='small'
							label='Query'
							helperText='Query to filter assets in the folder with.'
							defaultValue={query}
							onChange={(event) => {
								setQueryValue(event.target.value)
							}}
						/>
						<Box style={{ flexGrow: 1 }} />
						<Box style={{ paddingBottom: 2 }}>
							<IconButton
								size='small'
								aria-label={`select all`}
								title='Select all'
								onClick={app.handleSelectAllImportItems}>
								<GridViewSharp />
							</IconButton>
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
								aria-label={`select all out-of-sync`}
								title='Select all out-of-sync'
								onClick={app.handleSelectAllOutOfSyncImportItems}>
								<Badge color='success' variant='dot'>
									<GridViewSharp />
								</Badge>
							</IconButton>
							<IconButton
								size='small'
								aria-label={`select none`}
								title='Select none'
								onClick={app.handleSelectNoneImportItems}>
								<GridViewOutlined />
							</IconButton>
						</Box>
					</Stack>
					<Stack sx={{ w: '100%' }}>
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
								<Box
									sx={{
										width: '100%',
										display: 'flex',
										flexDirection: 'row',
										flexWrap: 'wrap',
										p: 1
									}}>

									{
										app.importItems.map((item: MediaItem, index: number) => (
											<ImageListItem style={{ width: '200px' }} key={item.id}>
												<Box
													key={item.img}
													sx={{ mt: 1, ml: 1, mr: 1 }}
													style={{ position: 'relative' }}>
													<GenericImage
														item={item}
														w={150}
														disabled={item.disabled}
														updated={item.updated}
														outOfSync={item.outOfSync}
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
														aria-label={`select ${item.entry.photo.name}`}
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
														<Tooltip title={item.entry.photo.name} followCursor={true}>
															<Typography variant='subtitle1' noWrap>
																{item.entry.photo.name}
															</Typography>
														</Tooltip>
													}
													subtitle={
														<>
															{
																params.metadataMap.filter(meta => meta.visibility.indexOf('import') !== -1).map(meta => {
																	return (<Tooltip title={metaToString(meta, item.entry[meta.target])} followCursor={true} key={`${meta.target}-${index}`}>
																		<Typography variant='subtitle2' noWrap>
																			{meta.label}: {metaToString(meta, item.entry[meta.target])}
																		</Typography>
																	</Tooltip>)
																})
															}
														</>
													}
													style={{
														color: `${item.disabled
																? '#bbb'
																: item.updated
																	? 'orange'
																	: item.outOfSync
																		? 'green'
																		:'#000'
															}`,
														padding: '3px'
													}}
													sx={{
														mb: 1,
														ml: 1,
														mr: 1,
														cursor: 'pointer',
														bgcolor: `${item.selected ? '#ddd' : ''}`
													}}
													onClick={() => {
														app.selectImportItem(item.id)
													}}
													position='below'
												/>
											</ImageListItem>
										))}
									{
										isEmpty && (
											<Alert sx={{ margin: 'auto' }} severity="info">This {folderId === repoId ? 'repo' : 'folder'} has no image assets in it. Please select another folder and refine your query.</Alert>
										)
									}
								</Box>
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
