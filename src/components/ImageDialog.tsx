import { Box, Dialog, IconButton } from '@mui/material'
import { CloseOutlined, InfoOutlined } from '@mui/icons-material'
import InfoPanel from './InfoPanel'
import { AppContext } from '../app-context'
import { useContext } from 'react'

const ImageDialog = () => {
	const app = useContext(AppContext)
	return (
		<Dialog
			fullScreen
			open={app.fullscreenView}
			onClose={() => {
				if (app.setFullscreenView) app.setFullscreenView(false)
			}}
			PaperProps={{
				sx: { background: 'rgba(0, 0, 0, 0.2)' }
			}}>
			<Box sx={{ p: 4 }}>
				<Box sx={{ position: 'relative' }}>
					<img
						src={`${app.currentMedia?.img}??w=2048&h=1365&auto=format`}
						srcSet={`${app.currentMedia?.img}??w=2048&h=1365&auto=format&dpr=2 2x`}
						alt={app.currentMedia?.title}
						onClick={() => {
							if (app.setFullscreenView) app.setFullscreenView(false)
						}}
						loading='lazy'
						width={'100%'}
					/>
					<IconButton
						aria-label={`close import drawer`}
						size='small'
						sx={{ color: 'white', position: 'absolute', top: 8, left: 8 }}
						onClick={() => {
							if (app.setInfoPanelOpen) app.setInfoPanelOpen(!app.infoPanelOpen)
						}}>
						<InfoOutlined />
					</IconButton>

					{/* Info Panel */}
					{/* TODO: move to components */}
					{app.infoPanelOpen && <InfoPanel />}
					<IconButton
						aria-label={`close fullscreen view`}
						size='small'
						sx={{ color: 'white', position: 'absolute', top: 8, right: 8 }}
						onClick={() => {
							if (app.setFullscreenView) app.setFullscreenView(false)
						}}>
						<CloseOutlined />
					</IconButton>
				</Box>
				<Box
					sx={{ height: '1000%' }}
					onClick={() => {
						if (app.setFullscreenView) app.setFullscreenView(false)
					}}
				/>
			</Box>
		</Dialog>
	)
}

export default ImageDialog
