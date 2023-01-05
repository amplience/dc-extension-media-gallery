import { Box, Dialog, IconButton } from '@mui/material'

import { CloseOutlined, InfoOutlined } from '@mui/icons-material'
import { MediaItem } from '../model'
import InfoPanel from './InfoPanel'

type DialogProps = {
	fullscreenView: boolean
	currentMedia: MediaItem | null
	infoPanelOpen: boolean
	setFullscreenView: Function
	setInfoPanelOpen: Function
}

const ImageDialog = ({
	fullscreenView,
	currentMedia,
	infoPanelOpen,
	setFullscreenView,
	setInfoPanelOpen
}: DialogProps) => {
	return (
		<Dialog
			fullScreen
			open={fullscreenView}
			onClose={() => setFullscreenView(false)}
			PaperProps={{
				sx: { background: 'rgba(0, 0, 0, 0.2)' }
			}}>
			<Box sx={{ p: 4 }}>
				<Box sx={{ position: 'relative' }}>
					<img
						src={`${currentMedia?.img}??w=2048&h=1365&auto=format`}
						srcSet={`${currentMedia?.img}??w=2048&h=1365&auto=format&dpr=2 2x`}
						alt={currentMedia?.title}
						onClick={() => setFullscreenView(false)}
						loading='lazy'
						width={'100%'}
					/>
					<IconButton
						aria-label={`close import drawer`}
						size='small'
						sx={{ color: 'white', position: 'absolute', top: 8, left: 8 }}
						onClick={() => setInfoPanelOpen(!infoPanelOpen)}>
						<InfoOutlined />
					</IconButton>

					{/* Info Panel */}
					{/* TODO: move to components */}
					{infoPanelOpen && <InfoPanel currentMedia={currentMedia} />}
					<IconButton
						aria-label={`close fullscreen view`}
						size='small'
						sx={{ color: 'white', position: 'absolute', top: 8, right: 8 }}
						onClick={() => setFullscreenView(false)}>
						<CloseOutlined />
					</IconButton>
				</Box>
				<Box sx={{ height: '1000%' }} onClick={() => setFullscreenView(false)} />
			</Box>
		</Dialog>
	)
}

export default ImageDialog
