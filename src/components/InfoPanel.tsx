import { Box, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import { MediaItem } from '../model'

type args = {
	currentMedia: MediaItem | null
}

const InfoPanel = ({ currentMedia }: args) => {
	return (
		<Box
			sx={{
				position: 'absolute',
				top: 50,
				p: 2,
				left: 16,
				minWidth: '450px',
				borderRadius: 1,
				background: 'rgba(255, 255, 255, 0.4)'
			}}>
			<Typography variant='subtitle1'>Media Details</Typography>
			<Table size='small'>
				<TableBody>
					<TableRow>
						<TableCell sx={{ p: 0, borderBottom: 'none' }}>
							<Typography variant='caption'>Date modified</Typography>
						</TableCell>
						<TableCell sx={{ p: 0, borderBottom: 'none' }}>
							<Typography variant='caption'>
								{currentMedia?.dateModified &&
									new Date(currentMedia.dateModified).toLocaleString()}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ p: 0, borderBottom: 'none' }}>
							<Typography variant='caption'>Author</Typography>
						</TableCell>
						<TableCell sx={{ p: 0, borderBottom: 'none' }}>
							<Typography variant='caption'>{currentMedia?.author}</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ p: 0, borderBottom: 'none' }}>
							<Typography variant='caption'>Caption</Typography>
						</TableCell>
						<TableCell sx={{ p: 0, borderBottom: 'none' }}>
							<Typography variant='caption'>{currentMedia?.title}</Typography>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</Box>
	)
}

export default InfoPanel
