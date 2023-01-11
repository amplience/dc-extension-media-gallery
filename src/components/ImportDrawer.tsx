import {
	CloseOutlined,
	GridViewSharp,
	GridViewOutlined,
	CheckBoxOutlined,
	CheckBoxOutlineBlank
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
	Button
} from '@mui/material'
import RichObjectTreeView from './RichTreeView'
import { AppContext } from '../app-context'
import { useContext } from 'react'
import { assetsToItems } from '../model/conversion'
import GenericImage from './GenericImage'

const ImportDrawer = () => {
	const app = useContext(AppContext)
	return (
		<SwipeableDrawer
			PaperProps={{
				sx: { width: '90%', p: 2 }
			}}
			anchor={'left'}
			open={app.importDrawerOpen}
			onClose={() => {
				if (app.setImportDrawerOpen) app.setImportDrawerOpen(false)
			}}
			onOpen={() => {
				if (app.setImportDrawerOpen) app.setImportDrawerOpen(true)
			}}>
			<Stack spacing={2} sx={{ h: '100%' }}>
				<Stack direction={'row'}>
					<Typography sx={{ pb: 2 }} variant='h5' component='h5'>
						Import Media
					</Typography>
					<Box sx={{ flexGrow: 1 }} />
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
				<Stack spacing={4}>
					{/* Tree View */}
					{/* TODO: replace with a dropdown tree select */}
					{app.repo && (
						<RichObjectTreeView
							folders={app.repo?.folders}
							onChange={async (id: string) => {
								if (app.getEntries && app.setImportItems) {
									const entries = await app.getEntries(id)
									app.setImportItems(assetsToItems(entries))
								}
							}}
						/>
					)}
					<Divider />
					<Stack sx={{ w: '100%' }}>
						<Stack sx={{ pb: 4 }} direction={'row'}>
							<Box sx={{ flexGrow: 1 }} />
							<IconButton
								size='small'
								aria-label={`select all`}
								title='Select all'
								onClick={app.handleSelectAllImportItems}>
								<GridViewSharp />
							</IconButton>
							<IconButton
								size='small'
								aria-label={`select none`}
								title='Select none'
								onClick={app.handleSelectNoneImportItems}>
								<GridViewOutlined />
							</IconButton>
						</Stack>

						{/* Import image list */}
						{/* TODO: move to flex wrap */}
						{app.importItems && (
							<ImageList cols={5}>
								{app.importItems.map((item: any) => (
									<ImageListItem key={item.img}>
										<GenericImage item={item} w={150} zoomable={true} aspect={{w:3,h:2}} lazy={false} fillWidth={true}></GenericImage>
										<ImageListItemBar
											title={item.title}
											subtitle={<span>by: {item.author}</span>}
											position='below'
											actionIcon={
												<IconButton
													aria-label={`select ${item.title}`}
													title='Select'
													onClick={() => {
														app.selectImportItem(item.id)
													}}>
													{item.selected ? (
														<CheckBoxOutlined />
													) : (
														<CheckBoxOutlineBlank />
													)}
												</IconButton>
											}
											actionPosition='left'
										/>
									</ImageListItem>
								))}
							</ImageList>
						)}
					</Stack>
				</Stack>
				<Stack
					sx={{ pb: 4, pt: 2, position: 'sticky', backgroundColor: 'white', bottom: 0 }}
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
