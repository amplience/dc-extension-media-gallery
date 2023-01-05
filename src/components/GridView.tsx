import { DndContext, closestCenter } from '@dnd-kit/core'
import { restrictToWindowEdges, restrictToParentElement } from '@dnd-kit/modifiers'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import {
	VisibilityOutlined,
	EditOutlined,
	CheckBoxOutlined,
	CheckBoxOutlineBlank,
	DeleteOutline
} from '@mui/icons-material'
import { Stack, Box, IconButton, ImageListItemBar, Typography } from '@mui/material'
import { MediaItem } from '../model'
import SortableListItem from '../sortable-list-item'

type GridViewArgs = {
	sensors: any
	dragStart: any
	dragEnd: any
	items: MediaItem[]
	zoom: number
	handleFullScreenView: any
	handleDetailView: any
	selectItem: any
	removeItem: any
}

const GridView = ({
	sensors,
	dragStart,
	dragEnd,
	items,
	zoom,
	handleFullScreenView,
	handleDetailView,
	selectItem,
	removeItem
}: GridViewArgs) => {
	return (
		<Stack direction={'row'}>
			{/* <ImageList cols={Math.floor(cols / zoom)} gap={8} sx={{ p: '2px' }}> */}
			<Box
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					p: 1
				}}>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragStart={dragStart}
					onDragEnd={dragEnd}
					modifiers={[restrictToWindowEdges, restrictToParentElement]}>
					<SortableContext items={items} strategy={rectSortingStrategy}>
						{items.map((item: any, index: number) => (
							<SortableListItem key={item.img} id={item.id} zoom={zoom}>
								<Box sx={{ mt: 1, ml: 1, mr: 1 }} style={{ position: 'relative' }}>
									<img
										src={`${item.img}?w=${248 * zoom}&h=${
											164 * zoom
										}&fit=crop&auto=format`}
										srcSet={`${item.img}?w=${248 * zoom}&h=${
											164 * zoom
										}&fit=crop&auto=format&dpr=2 2x`}
										alt={item.title}
										loading='lazy'
										style={{ width: '100%' }}
										title='Click to zoom'
										id={item.id}
										onClick={() => handleFullScreenView(item)}
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
										onClick={() => handleFullScreenView(item)}>
										<VisibilityOutlined />
									</IconButton>
									<IconButton
										size='small'
										sx={{
											color: 'white',
											position: 'absolute',
											top: 4,
											right: 4
										}}
										aria-label={`edit`}
										title='Edit'
										onClick={() => handleDetailView(item)}>
										<EditOutlined />
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
										onClick={() => {
											selectItem(item.id)
										}}>
										{item.selected ? (
											<CheckBoxOutlined />
										) : (
											<CheckBoxOutlineBlank />
										)}
									</IconButton>
									<IconButton
										size='small'
										sx={{
											color: 'white',
											position: 'absolute',
											bottom: 4,
											right: 4
										}}
										title='Remove'
										aria-label={`delete`}
										onClick={() => removeItem(item.id)}>
										<DeleteOutline />
									</IconButton>
								</Box>
								<ImageListItemBar
									title={
										<Typography variant='subtitle1' noWrap>
											{item.title}
										</Typography>
									}
									subtitle={
										<Typography variant='subtitle2' noWrap>
											by: {item.author}
										</Typography>
									}
									sx={{
										p: 0,
										mb: 1,
										ml: 1,
										mr: 1,
										cursor: 'pointer',
										bgcolor: `${item.selected ? '#444' : ''}`
									}}
									position='below'
									onClick={() => selectItem(item.id)}
								/>
							</SortableListItem>
						))}
					</SortableContext>
				</DndContext>
			</Box>
			<Box sx={{ flexGrow: 1 }} />
		</Stack>
	)
}

export default GridView
