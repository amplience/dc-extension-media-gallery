import { DndContext, closestCenter } from '@dnd-kit/core'
import { restrictToWindowEdges, restrictToParentElement } from '@dnd-kit/modifiers'
import { SortableContext, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import {
	VisibilityOutlined,
	EditOutlined,
	CheckBoxOutlined,
	CheckBoxOutlineBlank,
	DeleteOutline
} from '@mui/icons-material'
import { Stack, Box, IconButton, ImageListItemBar, Typography, Tooltip } from '@mui/material'
import SortableListItem from '../sortable-list-item'
import { AppContext } from '../app-context'
import { useContext, useState } from 'react'
import GenericImage from './GenericImage'
import { MediaItem } from '../model'
import { useExtension } from '../extension-context'
import { metaToString } from '../model/metadata-map'

const GridView = () => {
	const app = useContext(AppContext)
	const { params } = useExtension();

	const [dragging, setDragging] = useState(false)

	/**
	 * Drag-end-Drop action start
	 * @param event
	 */
	const dragStart = (event: any) => {
		setDragging(true)
		if (app.setDragging) app.setDragging(true)
	}

	/**
	 * Drag-end-Drop action end
	 * @param event
	 */
	const dragEnd = (event: any) => {
		setDragging(false)
		if (app.setDragging) app.setDragging(false)
		const { active, over } = event
		if (active.id !== over.id) {
			const oldIndex = app.items.findIndex((item: MediaItem) => item.id === active.id)
			const newIndex = app.items.findIndex((item: MediaItem) => item.id === over.id)
			app.items = arrayMove(app.items, oldIndex, newIndex)
			app.dragOrder(active, over)
		}
	}

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
					onDragStart={dragStart}
					onDragEnd={dragEnd}
					modifiers={[restrictToWindowEdges, restrictToParentElement]}>
					<SortableContext items={app.items} strategy={rectSortingStrategy}>
						{app.items.map((item: any, index: number) => (
							<SortableListItem key={item.img} id={item.id} zoom={app.zoom}>
								<Box
									sx={{ mt: 1, ml: 1, mr: 1 }}
									style={{ position: 'relative', cursor: 'grab' }}>
									<div style={{ width: '100%', aspectRatio: '3/2' }}>
										<GenericImage
											item={item}
											w={248}
											zoomable={true}
											aspect={{ w: 3, h: 2 }}
											fillWidth={true}></GenericImage>
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
											aria-label={`select ${item.entry.photo.name}`}
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
									</div>
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
												params.metadataMap.filter(meta => meta.visibility.indexOf('grid') !== -1).map(meta => {
													return (<Tooltip title={item.entry[meta.target]} followCursor={true} key={`${meta.target}-${index}`}>
														<Typography variant='subtitle2' noWrap>
															{meta.label}: {metaToString(meta, item.entry[meta.target])}
														</Typography>
													</Tooltip>)
												})
											}
										</>
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
