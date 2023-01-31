import {
	CollectionsOutlined,
	AddPhotoAlternateOutlined,
	GridViewSharp,
	GridViewOutlined,
	DeleteOutline,
	SortOutlined,
	CachedOutlined,
	ArrowUpwardOutlined,
	ArrowDownwardOutlined,
	ZoomInOutlined,
	ZoomOutOutlined,
	ViewHeadlineOutlined,
	AppsOutlined
} from '@mui/icons-material'
import {
	AppBar,
	IconButton,
	Typography,
	Box,
	Divider,
	Badge,
	Menu,
	ListSubheader,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Toolbar
} from '@mui/material'
import { MediaItem } from '../model'
import { AppContext } from '../app-context'
import { useContext } from 'react'
import { useExtension } from '../extension-context'

/**
 * Toolbar component that provides access to global actions.
 * @returns AppToolbar Component
 */
const AppToolbar = () => {
	const app = useContext(AppContext)
	const { params } = useExtension()

	const metaSort = params.metadataMap
		.filter((meta) => meta.sortable)
		.map((meta) => {
			return (
				<>
					<MenuItem
						dense
						onClick={() => app.handleSortByMetaAsc(meta.target)}
						key={`${meta.target}-asc`}>
						<ListItemIcon>
							<ArrowUpwardOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>{meta.label} Asc</ListItemText>
					</MenuItem>
					<MenuItem
						dense
						onClick={() => app.handleSortByMetaDesc(meta.target)}
						key={`${meta.target}-desc`}>
						<ListItemIcon>
							<ArrowDownwardOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>{meta.label} Desc</ListItemText>
					</MenuItem>
				</>
			)
		})

	return (
		<AppBar position='sticky'>
			<Toolbar variant='dense'>
				<IconButton
					edge='start'
					color='inherit'
					aria-label='menu'
					sx={{ mr: 2 }}
					onClick={(event) => app.handleContextMenu(event)}>
					<CollectionsOutlined />
				</IconButton>
				<Typography variant='h6' color='inherit' component='div'>
					Image Gallery
				</Typography>
				<Box sx={{ flexGrow: 1 }} />
				<IconButton
					sx={{ color: 'white' }}
					aria-label={`import`}
					size='small'
					title='Import'
					disabled={app.chApi == null}
					onClick={app.handleImport}>
					<AddPhotoAlternateOutlined />
				</IconButton>
				<Divider orientation='vertical' variant='middle' sx={{ ml: 1, mr: 1 }} flexItem />
				<IconButton
					sx={{ color: 'white' }}
					size='small'
					aria-label={`select all`}
					title='Select all'
					onClick={app.handleSelectAll}>
					<GridViewSharp />
				</IconButton>
				<IconButton
					sx={{ color: 'white' }}
					size='small'
					aria-label={`select none`}
					title='Select none'
					onClick={app.handleSelectNone}>
					<GridViewOutlined />
				</IconButton>
				<Divider orientation='vertical' variant='middle' sx={{ ml: 1, mr: 1 }} flexItem />
				<IconButton
					sx={{ color: 'white' }}
					aria-label={`remove selected`}
					title='Remove selected'
					size='small'
					onClick={app.handleRemoveSelected}>
					<Badge
						badgeContent={app.items?.filter((item: MediaItem) => item.selected).length}
						color='secondary'>
						<DeleteOutline />
					</Badge>
				</IconButton>
				<IconButton
					sx={{ color: 'white' }}
					aria-label={`sort`}
					title='Sort by'
					onClick={app.handleSortClick}
					size='small'
					id='toolbar-icon-sort'>
					<SortOutlined />
				</IconButton>
				<IconButton
					sx={{ color: 'white' }}
					aria-label={`reset`}
					size='small'
					title='Reset'
					onClick={app.handleResetItems}>
					<CachedOutlined />
				</IconButton>

				{/* Sort menu */}
				<Menu
					id='basic-menu'
					anchorEl={app.sortAnchorEl}
					open={app.sortOpen}
					onClose={app.handleSortClose}
					MenuListProps={{
						'aria-labelledby': 'basic-button'
					}}
					PaperProps={{
						style: {
							width: '270px'
						}
					}}>
					<ListSubheader>Sort By</ListSubheader>
					<MenuItem dense autoFocus onClick={app.handleSortByNameAsc}>
						<ListItemIcon>
							<ArrowUpwardOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>Name Asc</ListItemText>
					</MenuItem>
					<MenuItem dense onClick={app.handleSortByNameDesc}>
						<ListItemIcon>
							<ArrowDownwardOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>Name Desc</ListItemText>
					</MenuItem>
					<MenuItem dense autoFocus onClick={app.handleSortByDateAsc}>
						<ListItemIcon>
							<ArrowUpwardOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>Date Modified Asc</ListItemText>
					</MenuItem>
					<MenuItem dense onClick={app.handleSortByDateDesc}>
						<ListItemIcon>
							<ArrowDownwardOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>Date Modified Desc</ListItemText>
					</MenuItem>
					{metaSort}
				</Menu>
				<Divider orientation='vertical' variant='middle' sx={{ ml: 1, mr: 1 }} flexItem />
				<IconButton
					sx={{ color: 'white' }}
					aria-label={`zoom in`}
					title='Zoom In'
					disabled={app.zoom === 2 || !app.gridMode}
					onClick={app.handleZoomIn}>
					<ZoomInOutlined />
				</IconButton>
				<IconButton
					sx={{ color: 'white' }}
					aria-label={`zoom out`}
					title='Zoom Out'
					disabled={app.zoom === 1 / 2 || !app.gridMode}
					onClick={app.handleZoomOut}>
					<ZoomOutOutlined />
				</IconButton>
				{app.gridMode && (
					<IconButton
						sx={{ color: 'white' }}
						aria-label={`list mode`}
						title='List view'
						onClick={() => {
							if (app.setGridMode) {
								app.setGridMode(false)
							}
						}}>
						<ViewHeadlineOutlined />
					</IconButton>
				)}
				{!app.gridMode && (
					<IconButton
						sx={{ color: 'white' }}
						aria-label={`grid mode`}
						title='Grid view'
						onClick={() => {
							if (app.setGridMode) app.setGridMode(true)
						}}>
						<AppsOutlined />
					</IconButton>
				)}
			</Toolbar>
		</AppBar>
	)
}

export default AppToolbar
