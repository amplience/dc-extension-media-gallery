import { DndContext, closestCenter } from '@dnd-kit/core'
import {
	restrictToVerticalAxis,
	restrictToWindowEdges,
	restrictToParentElement
} from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import {
	CheckBoxOutlined,
	CheckBoxOutlineBlank,
	VisibilityOutlined,
	EditOutlined,
	DeleteOutline
} from '@mui/icons-material'
import {
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton,
	Tooltip
} from '@mui/material'
import SortableTableRow from '../sortable-table-row'
import { AppContext } from '../app-context'
import { useContext, useState } from 'react'
import GenericImage from './GenericImage'
import { MediaItem } from '../model'
import { useExtension } from '../extension-context'
import { metaToString } from '../model/metadata-map'

const ItemListView = () => {
	const app = useContext(AppContext)
	const { params } = useExtension()

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

	const listMeta = params.metadataMap.filter(meta => meta.visibility.indexOf('list') !== -1);

	const metaHeaders = listMeta.map(meta => {
		return (<TableCell
			sx={{
				borderBottom: 'none',
				color: 'white',
				fontWeight: 'bold'
			}}
			component='th'
			align='left'>
			{meta.label}
		</TableCell>)
	})

	return (
		<DndContext
			sensors={app.sensors}
			collisionDetection={closestCenter}
			onDragStart={dragStart}
			onDragEnd={dragEnd}
			modifiers={[restrictToVerticalAxis, restrictToWindowEdges, restrictToParentElement]}>
			<SortableContext items={app.items} strategy={verticalListSortingStrategy}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell sx={{ borderBottom: 'none' }} component='th' />
							<TableCell
								sx={{
									borderBottom: 'none',
									color: 'white',
									fontWeight: 'bold'
								}}
								component='th'>
								Media
							</TableCell>
							<TableCell
								sx={{
									borderBottom: 'none',
									color: 'white',
									fontWeight: 'bold'
								}}
								component='th'
								align='left'>
								Actions
							</TableCell>
							<TableCell
								sx={{
									borderBottom: 'none',
									color: 'white',
									fontWeight: 'bold'
								}}
								component='th'
								align='left'>
								Name
							</TableCell>
							{metaHeaders}
						</TableRow>
					</TableHead>
					<TableBody>
						{app.items.map((item: any, index: number) => {
							const metaBody = listMeta.map(meta => {
								return (<Tooltip title={metaToString(meta, item.entry[meta.target])} followCursor={true}>
									<TableCell
										sx={{
											cursor: 'pointer',
											borderBottom: 'none',
											bgcolor: `${item.selected ? '#444' : ''}`,
											color: 'white'
										}}
										id={item.id}
										onClick={() => app.selectItem(item.id)}
										align='left'>
										{metaToString(meta, item.entry[meta.target])}
									</TableCell>
								</Tooltip>)
							})

							return (<SortableTableRow key={item.img} id={item.id}>
								<TableCell
									id={item.id}
									sx={{
										borderBottom: 'none',
										bgcolor: `${item.selected ? '#444' : ''}`
									}}>
									<IconButton
										sx={{ color: 'white' }}
										aria-label={`select`}
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
								</TableCell>
								<TableCell
									id={item.id}
									sx={{
										borderBottom: 'none',
										bgcolor: `${item.selected ? '#444' : ''}`
									}}>
									<div style={{ width: '140px' }}>
										<GenericImage
											item={item}
											w={140}
											zoomable={true}
											forceNoZoom={true}
											aspect={{ w: 3, h: 2 }}></GenericImage>
									</div>
								</TableCell>
								<TableCell
									align='left'
									id={item.id}
									sx={{
										borderBottom: 'none',
										bgcolor: `${item.selected ? '#444' : ''}`
									}}>
									<IconButton
										sx={{ color: 'white' }}
										aria-label={`view fullscreen`}
										title='Click to zoom'
										onClick={() => app.handleFullScreenView(item)}>
										<VisibilityOutlined />
									</IconButton>
									<IconButton
										sx={{ color: 'white' }}
										aria-label={`edit`}
										title='Edit'
										onClick={() => app.handleDetailView(item)}>
										<EditOutlined />
									</IconButton>
									<IconButton
										sx={{ color: 'white' }}
										aria-label={`delete`}
										title='Remove'
										onClick={() => app.removeItem(item.id)}>
										<DeleteOutline />
									</IconButton>
								</TableCell>
								<Tooltip title={item.entry.photo.name} followCursor={true}>
									<TableCell
										sx={{
											cursor: 'pointer',
											borderBottom: 'none',
											bgcolor: `${item.selected ? '#444' : ''}`,
											color: 'white'
										}}
										id={item.id}
										onClick={() => app.selectItem(item.id)}
										align='left'>
										{item.entry.photo.name}
									</TableCell>
								</Tooltip>
								{metaBody}
							</SortableTableRow>
						)
						})}
					</TableBody>
				</Table>
			</SortableContext>
		</DndContext>
	)
}

export default ItemListView
