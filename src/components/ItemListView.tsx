import { DndContext, closestCenter } from '@dnd-kit/core'
import {
	restrictToVerticalAxis,
	restrictToWindowEdges,
	restrictToParentElement
} from '@dnd-kit/modifiers'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
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
import { useContext } from 'react'

const ItemListView = () => {
	const app = useContext(AppContext)
	return (
		<DndContext
			sensors={app.sensors}
			collisionDetection={closestCenter}
			onDragStart={app.dragStart}
			onDragEnd={app.dragEnd}
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
								Title
							</TableCell>
							<TableCell
								sx={{
									borderBottom: 'none',
									color: 'white',
									fontWeight: 'bold'
								}}
								component='th'
								align='left'>
								Author
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{app.items.map((item: any, index: number) => (
							<SortableTableRow key={item.img} id={item.id}>
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
									<img
										src={`${item.img}?w=62&h=41&sm=clamp&fmt=auto&qlt=60&fmt.jpeg.interlaced=true`}
										srcSet={`${item.img}?w=124&h=82&sm=clamp&fmt=auto&qlt=60&fmt.jpeg.interlaced=true 2x`}
										alt={item.title}
										title='Click to zoom'
										onClick={() => app.handleFullScreenView(item)}
										style={{ cursor: 'zoom-in' }}
										id={item.id}
										loading='lazy'
									/>
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
								<Tooltip title={item.title} followCursor={true}>
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
										{item.title}
									</TableCell>
								</Tooltip>
								<Tooltip title={item.author} followCursor={true}>
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
										{item.author}
									</TableCell>
								</Tooltip>
							</SortableTableRow>
						))}
					</TableBody>
				</Table>
			</SortableContext>
		</DndContext>
	)
}

export default ItemListView
