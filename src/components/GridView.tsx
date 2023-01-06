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
import SortableListItem from '../sortable-list-item'
import { AppContext } from '../app-context'
import { useContext } from 'react'

const GridView = () => {
	const app = useContext(AppContext)
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
					sensors={app.sensors}
					collisionDetection={closestCenter}
					onDragStart={app.dragStart}
					onDragEnd={app.dragEnd}
					modifiers={[restrictToWindowEdges, restrictToParentElement]}>
					<SortableContext items={app.items} strategy={rectSortingStrategy}>
						{app.items?.map((item: any, index: number) => (
							<SortableListItem key={item.img} id={item.id} zoom={app.zoom}>
								<Box sx={{ mt: 1, ml: 1, mr: 1 }} style={{ position: 'relative' }}>
									<img
										src={`${item.img}?w=${248 * app.zoom}&h=${
											164 * app.zoom
										}&fit=crop&auto=format`}
										srcSet={`${item.img}?w=${248 * app.zoom}&h=${
											164 * app.zoom
										}&fit=crop&auto=format&dpr=2 2x`}
										alt={item.title}
										loading='lazy'
										style={{ width: '100%', aspectRatio: '1.5/1' }}
										title='Click to zoom'
										id={item.id}
										onClick={() => app.handleFullScreenView(item)}
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
											top: 4,
											right: 4
										}}
										aria-label={`edit`}
										title='Edit'
										onClick={() => app.handleDetailView(item)}>
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
											app.selectItem(item.id)
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
										onClick={() => app.removeItem(item.id)}>
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
									onClick={() => app.selectItem(item.id)}
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
