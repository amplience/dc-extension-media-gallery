import {
	CheckBoxOutlineBlank,
	CheckBoxOutlined,
	VisibilityOutlined,
	EditOutlined,
	DeleteOutline,
	AddPhotoAlternateOutlined,
	GridViewSharp,
	GridViewOutlined,
	SortByAlphaOutlined,
	CachedOutlined,
	ZoomInOutlined,
	ZoomOutOutlined,
	ViewHeadlineOutlined,
	AppsOutlined,
	VerticalAlignTop,
	VerticalAlignBottom
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
import { AppContext } from '../app-context'
import { useContext } from 'react'

/**
 * Context menu for media items, providing access to actions relating to them.
 * @returns ContextMenu Component
 */
const ContextMenu = () => {
	const app = useContext(AppContext)
	return (
		<Menu
			open={app.contextMenu !== null}
			onClose={app.handleContextClose}
			anchorReference='anchorPosition'
			anchorPosition={
				app.contextMenu !== null
					? { top: app.contextMenu.mouseY, left: app.contextMenu.mouseX }
					: undefined
			}
			PaperProps={{
				style: {
					width: '300px'
				}
			}}>
			{app.contextMedia != null && (
				<>
					<ListSubheader
						style={{
							width: '250px',
							height: '50px',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						}}>
						{app.contextMedia.entry.photo.name}
					</ListSubheader>
					{!app.contextMedia.selected && (
						<MenuItem
							dense
							onClick={() => {
								if (app.contextMedia) {
									app.handleContextClose()
									app.selectItem(app.contextMedia.id)
								}
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
					{app.contextMedia.selected && (
						<MenuItem
							dense
							onClick={() => {
								if (app.contextMedia) {
									app.handleContextClose()
									app.selectItem(app.contextMedia.id)
								}
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
							if (app.contextMedia) {
								app.handleContextClose()
								app.handleFullScreenView(app.contextMedia)
							}
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
							if (app.contextMedia) {
								app.handleContextClose()
								app.handleDetailView(app.contextMedia)
							}
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
							if (app.contextMedia) {
								app.handleContextClose()
								app.removeItem(app.contextMedia.id)
							}
						}}>
						<ListItemIcon>
							<DeleteOutline fontSize='small' />
						</ListItemIcon>
						<ListItemText>Remove</ListItemText>
						<Typography variant='body2' color='text.secondary'>
							r
						</Typography>
					</MenuItem>
					<MenuItem
						dense
						onClick={() => {
							if (app.contextMedia) {
								app.handleContextClose()
								app.handleMoveToTop(app.contextMedia)
							}
						}}>
						<ListItemIcon>
							<VerticalAlignTop fontSize='small' />
						</ListItemIcon>
						<ListItemText>Move to top</ListItemText>
						<Typography variant='body2' color='text.secondary'>
							t
						</Typography>
					</MenuItem>
					<MenuItem
						dense
						onClick={() => {
							if (app.contextMedia) {
								app.handleContextClose()
								app.handleMoveToBottom(app.contextMedia)
							}
						}}>
						<ListItemIcon>
							<VerticalAlignBottom fontSize='small' />
						</ListItemIcon>
						<ListItemText>Move to bottom</ListItemText>
						<Typography variant='body2' color='text.secondary'>
							b
						</Typography>
					</MenuItem>
					<Divider />
				</>
			)}
			<ListSubheader>Global</ListSubheader>
			<MenuItem
				autoFocus={app.contextMedia == null}
				dense
				onClick={() => {
					app.handleContextClose()
					app.handleImport()
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
					app.handleContextClose()
					app.handleSelectAll()
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
					app.handleContextClose()
					app.handleSelectNone()
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
					app.handleContextClose()
					app.handleRemoveSelected()
				}}>
				<ListItemIcon>
					<DeleteOutline fontSize='small' />
				</ListItemIcon>
				<ListItemText>
					<Badge
						badgeContent={app.items.filter((item: any) => item.selected).length}
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
					app.handleSortClick(event)
					app.handleContextClose()
				}}>
				<ListItemIcon>
					<SortByAlphaOutlined fontSize='small' />
				</ListItemIcon>
				<ListItemText>Sort by</ListItemText>
				<Typography variant='body2' color='text.secondary'>
					s
				</Typography>
			</MenuItem>
			<MenuItem
				dense
				onClick={() => {
					app.handleContextClose()
					app.handleResetItems()
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
				disabled={app.zoom === 2 || !app.gridMode}
				dense
				onClick={() => {
					app.handleContextClose()
					app.handleZoomIn()
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
				disabled={app.zoom === 1 / 2 || !app.gridMode}
				dense
				onClick={() => {
					app.handleContextClose()
					app.handleZoomOut()
				}}>
				<ListItemIcon>
					<ZoomOutOutlined />
				</ListItemIcon>
				<ListItemText>Zoom Out</ListItemText>
				<Typography variant='body2' color='text.secondary'>
					-
				</Typography>
			</MenuItem>
			{app.gridMode ? (
				<MenuItem
					dense
					onClick={() => {
						if (app.setGridMode) {
							app.handleContextClose()
							app.setGridMode(false)
						}
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
						if (app.setGridMode) {
							app.handleContextClose()
							app.setGridMode(true)
						}
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
