import {
	CheckBoxOutlineBlank,
	CheckBoxOutlined,
	VisibilityOutlined,
	EditOutlined,
	DeleteOutline,
	AddPhotoAlternateOutlined,
	GridViewSharp,
	GridViewOutlined,
	SortOutlined,
	CachedOutlined,
	ZoomInOutlined,
	ZoomOutOutlined,
	ViewHeadlineOutlined,
	AppsOutlined
} from '@mui/icons-material'
import {
	Menu,
	ListSubheader,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Typography,
	Divider,
	Badge,
	Box
} from '@mui/material'
import { MediaItem } from '../model'

type ContextArgs = {
	contextMenu: any
	contextMedia: MediaItem | null
	gridMode: boolean
	selectItem: any
	handleContextClose: any
	handleFullScreenView: any
	handleDetailView: any
	handleImport: any
	handleSelectAll: any
	handleSelectNone: any
	handleRemoveSelected: any
	handleSortClick: any
	handleResetItems: any
	handleZoomIn: any
	handleZoomOut: any
	items: MediaItem[]
	removeItem: any
	setGridMode: any
	zoom: number
}

const ContextMenu = ({
	contextMenu,
	contextMedia,
	gridMode,
	selectItem,
	handleContextClose,
	handleFullScreenView,
	handleDetailView,
	handleImport,
	handleSelectAll,
	handleSelectNone,
	handleRemoveSelected,
	handleSortClick,
	handleResetItems,
	handleZoomIn,
	handleZoomOut,
	items,
	removeItem,
	setGridMode,
	zoom
}: ContextArgs) => {
	return (
		<Menu
			open={contextMenu !== null}
			onClose={handleContextClose}
			anchorReference='anchorPosition'
			anchorPosition={
				contextMenu !== null
					? { top: contextMenu.mouseY, left: contextMenu.mouseX }
					: undefined
			}
			PaperProps={{
				style: {
					width: '300px'
				}
			}}>
			{contextMedia != null && (
				<>
					<ListSubheader
						style={{
							width: '250px',
							height: '50px',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						}}>
						{contextMedia.title}
					</ListSubheader>
					{!contextMedia.selected && (
						<MenuItem
							dense
							onClick={() => {
								handleContextClose()
								selectItem(contextMedia.id)
							}}>
							<ListItemIcon>
								<CheckBoxOutlineBlank fontSize='small' />
							</ListItemIcon>
							<ListItemText>Select</ListItemText>
							<Typography variant='body2' color='text.secondary'>
								Space
							</Typography>
						</MenuItem>
					)}
					{contextMedia.selected && (
						<MenuItem
							dense
							onClick={() => {
								handleContextClose()
								selectItem(contextMedia.id)
							}}>
							<ListItemIcon>
								<CheckBoxOutlined fontSize='small' />
							</ListItemIcon>
							<ListItemText>De-select</ListItemText>
							<Typography variant='body2' color='text.secondary'>
								Space
							</Typography>
						</MenuItem>
					)}
					<MenuItem
						dense
						autoFocus
						onClick={() => {
							handleContextClose()
							handleFullScreenView(contextMedia)
						}}>
						<ListItemIcon>
							<VisibilityOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>View</ListItemText>
						<Typography variant='body2' color='text.secondary'>
							v
						</Typography>
					</MenuItem>
					<MenuItem
						dense
						onClick={() => {
							handleContextClose()
							handleDetailView(contextMedia)
						}}>
						<ListItemIcon>
							<EditOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>Edit</ListItemText>
						<Typography variant='body2' color='text.secondary'>
							e
						</Typography>
					</MenuItem>
					<MenuItem
						dense
						onClick={() => {
							handleContextClose()
							removeItem(contextMedia.id)
						}}>
						<ListItemIcon>
							<DeleteOutline fontSize='small' />
						</ListItemIcon>
						<ListItemText>Remove</ListItemText>
						<Typography variant='body2' color='text.secondary'>
							r
						</Typography>
					</MenuItem>
					<Divider />
				</>
			)}
			<ListSubheader>Global</ListSubheader>
			<MenuItem
				autoFocus={contextMedia == null}
				dense
				onClick={() => {
					handleContextClose()
					handleImport()
				}}>
				<ListItemIcon>
					<AddPhotoAlternateOutlined fontSize='small' />
				</ListItemIcon>
				<ListItemText>Import</ListItemText>
				<Typography variant='body2' color='text.secondary'>
					i
				</Typography>
			</MenuItem>
			<Divider />
			<MenuItem
				dense
				onClick={() => {
					handleContextClose()
					handleSelectAll()
				}}>
				<ListItemIcon>
					<GridViewSharp fontSize='small' />
				</ListItemIcon>
				<ListItemText>Select all</ListItemText>
				<Typography variant='body2' color='text.secondary'>
					a
				</Typography>
			</MenuItem>
			<MenuItem
				dense
				onClick={() => {
					handleContextClose()
					handleSelectNone()
				}}>
				<ListItemIcon>
					<GridViewOutlined fontSize='small' />
				</ListItemIcon>
				<ListItemText>Select none</ListItemText>
				<Typography variant='body2' color='text.secondary'>
					n
				</Typography>
			</MenuItem>
			<Divider />
			<MenuItem
				dense
				onClick={() => {
					handleContextClose()
					handleRemoveSelected()
				}}>
				<ListItemIcon>
					<DeleteOutline fontSize='small' />
				</ListItemIcon>
				<ListItemText>
					<Badge
						badgeContent={items.filter((item: any) => item.selected).length}
						color='secondary'>
						Remove selected
						<Box style={{ width: '10px' }} />
					</Badge>
				</ListItemText>
				<Typography variant='body2' color='text.secondary'>
					R
				</Typography>
			</MenuItem>
			<MenuItem
				dense
				onClick={(event) => {
					handleSortClick(event)
					handleContextClose()
				}}>
				<ListItemIcon>
					<SortOutlined fontSize='small' />
				</ListItemIcon>
				<ListItemText>Sort by</ListItemText>
				<Typography variant='body2' color='text.secondary'>
					s
				</Typography>
			</MenuItem>
			<MenuItem
				dense
				onClick={() => {
					handleContextClose()
					handleResetItems()
				}}>
				<ListItemIcon>
					<CachedOutlined fontSize='small' />
				</ListItemIcon>
				<ListItemText>Reset</ListItemText>
				<Typography variant='body2' color='text.secondary'>
					Z
				</Typography>
			</MenuItem>
			<Divider />
			<MenuItem
				disabled={zoom === 2 || !gridMode}
				dense
				onClick={() => {
					handleContextClose()
					handleZoomIn()
				}}>
				<ListItemIcon>
					<ZoomInOutlined />
				</ListItemIcon>
				<ListItemText>Zoom In</ListItemText>
				<Typography variant='body2' color='text.secondary'>
					+
				</Typography>
			</MenuItem>
			<MenuItem
				disabled={zoom === 1 / 2 || !gridMode}
				dense
				onClick={() => {
					handleContextClose()
					handleZoomOut()
				}}>
				<ListItemIcon>
					<ZoomOutOutlined />
				</ListItemIcon>
				<ListItemText>Zoom Out</ListItemText>
				<Typography variant='body2' color='text.secondary'>
					-
				</Typography>
			</MenuItem>
			{gridMode ? (
				<MenuItem
					dense
					onClick={() => {
						handleContextClose()
						setGridMode(false)
					}}>
					<ListItemIcon>
						<ViewHeadlineOutlined fontSize='small' />
					</ListItemIcon>
					<ListItemText>List view</ListItemText>
					<Typography variant='body2' color='text.secondary'>
						l
					</Typography>
				</MenuItem>
			) : (
				<MenuItem
					dense
					onClick={() => {
						handleContextClose()
						setGridMode(true)
					}}>
					<ListItemIcon>
						<AppsOutlined fontSize='small' />
					</ListItemIcon>
					<ListItemText>Grid view</ListItemText>
					<Typography variant='body2' color='text.secondary'>
						g
					</Typography>
				</MenuItem>
			)}
		</Menu>
	)
}

export default ContextMenu
