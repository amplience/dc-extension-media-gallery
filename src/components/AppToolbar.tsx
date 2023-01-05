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

type AppToolbarArgs = {
	gridMode: boolean
	items: MediaItem[]
	handleContextMenu: any
	handleImport: any
	handleSelectAll: any
	handleSelectNone: any
	handleRemoveSelected: any
	handleSortClick: any
	handleResetItems: any
	handleSortByDateAsc: any
	handleSortByDateDesc: any
	handleSortByAuthorAsc: any
	handleSortByAuthorDesc: any
	handleSortByCaptionAsc: any
	handleSortByCaptionDesc: any
	handleSortClose: any
	handleZoomIn: any
	handleZoomOut: any
	setGridMode: any
	sortAnchorEl: HTMLElement | null
	sortOpen: boolean
	zoom: number
}

const AppToolbar = ({
	gridMode,
	items,
	handleContextMenu,
	handleImport,
	handleSelectAll,
	handleSelectNone,
	handleRemoveSelected,
	handleSortClick,
	handleResetItems,
	handleSortByDateAsc,
	handleSortByDateDesc,
	handleSortByAuthorAsc,
	handleSortByAuthorDesc,
	handleSortByCaptionAsc,
	handleSortByCaptionDesc,
	handleSortClose,
	handleZoomIn,
	handleZoomOut,
	setGridMode,
	sortAnchorEl,
	sortOpen,
	zoom
}: AppToolbarArgs) => {
	return (
		<AppBar position='sticky'>
			<Toolbar variant='dense'>
				<IconButton
					edge='start'
					color='inherit'
					aria-label='menu'
					sx={{ mr: 2 }}
					onClick={(event) => handleContextMenu(event)}>
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
					onClick={handleImport}>
					<AddPhotoAlternateOutlined />
				</IconButton>
				<Divider orientation='vertical' variant='middle' sx={{ ml: 1, mr: 1 }} flexItem />
				<IconButton
					sx={{ color: 'white' }}
					size='small'
					aria-label={`select all`}
					title='Select all'
					onClick={handleSelectAll}>
					<GridViewSharp />
				</IconButton>
				<IconButton
					sx={{ color: 'white' }}
					size='small'
					aria-label={`select none`}
					title='Select none'
					onClick={handleSelectNone}>
					<GridViewOutlined />
				</IconButton>
				<Divider orientation='vertical' variant='middle' sx={{ ml: 1, mr: 1 }} flexItem />
				<IconButton
					sx={{ color: 'white' }}
					aria-label={`remove selected`}
					title='Remove selected'
					size='small'
					onClick={handleRemoveSelected}>
					<Badge
						badgeContent={items.filter((item: MediaItem) => item.selected).length}
						color='secondary'>
						<DeleteOutline />
					</Badge>
				</IconButton>
				<IconButton
					sx={{ color: 'white' }}
					aria-label={`sort`}
					title='Sort by'
					onClick={handleSortClick}
					size='small'
					id='toolbar-icon-sort'>
					<SortOutlined />
				</IconButton>
				<IconButton
					sx={{ color: 'white' }}
					aria-label={`reset`}
					size='small'
					title='Reset'
					onClick={handleResetItems}>
					<CachedOutlined />
				</IconButton>

				{/* Sort menu */}
				{/* TODO: move to components */}
				<Menu
					id='basic-menu'
					anchorEl={sortAnchorEl}
					open={sortOpen}
					onClose={handleSortClose}
					MenuListProps={{
						'aria-labelledby': 'basic-button'
					}}
					PaperProps={{
						style: {
							width: '270px'
						}
					}}>
					<ListSubheader>Sort By</ListSubheader>
					<MenuItem dense autoFocus onClick={handleSortByDateAsc}>
						<ListItemIcon>
							<ArrowUpwardOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>Date Modified Asc</ListItemText>
					</MenuItem>
					<MenuItem dense onClick={handleSortByDateDesc}>
						<ListItemIcon>
							<ArrowDownwardOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>Date Modified Desc</ListItemText>
					</MenuItem>
					<MenuItem dense onClick={handleSortByAuthorAsc}>
						<ListItemIcon>
							<ArrowUpwardOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>Author Asc</ListItemText>
					</MenuItem>
					<MenuItem dense onClick={handleSortByAuthorDesc}>
						<ListItemIcon>
							<ArrowDownwardOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>Author Desc</ListItemText>
					</MenuItem>
					<MenuItem dense onClick={handleSortByCaptionAsc}>
						<ListItemIcon>
							<ArrowUpwardOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>Caption Asc</ListItemText>
					</MenuItem>
					<MenuItem dense onClick={handleSortByCaptionDesc}>
						<ListItemIcon>
							<ArrowDownwardOutlined fontSize='small' />
						</ListItemIcon>
						<ListItemText>Caption Desc</ListItemText>
					</MenuItem>
				</Menu>
				<Divider orientation='vertical' variant='middle' sx={{ ml: 1, mr: 1 }} flexItem />
				<IconButton
					sx={{ color: 'white' }}
					aria-label={`zoonm in`}
					title='Zoom In'
					disabled={zoom === 2 || !gridMode}
					onClick={handleZoomIn}>
					<ZoomInOutlined />
				</IconButton>
				<IconButton
					sx={{ color: 'white' }}
					aria-label={`zoonm out`}
					title='Zoom Out'
					disabled={zoom === 1 / 2 || !gridMode}
					onClick={handleZoomOut}>
					<ZoomOutOutlined />
				</IconButton>
				{gridMode && (
					<IconButton
						sx={{ color: 'white' }}
						aria-label={`list mode`}
						title='List view'
						onClick={() => setGridMode(false)}>
						<ViewHeadlineOutlined />
					</IconButton>
				)}
				{!gridMode && (
					<IconButton
						sx={{ color: 'white' }}
						aria-label={`grid mode`}
						title='Grid view'
						onClick={() => setGridMode(true)}>
						<AppsOutlined />
					</IconButton>
				)}
			</Toolbar>
		</AppBar>
	)
}

export default AppToolbar
