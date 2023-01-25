import { Box, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import { AppContext } from '../app-context'
import { useContext } from 'react'
import { useExtension } from '../extension-context'
import { metaToString } from '../model/metadata-map'

const InfoPanel = () => {
	const app = useContext(AppContext)
	const { params } = useExtension();

	const metaInfo = params.metadataMap.filter(meta => meta.visibility.indexOf('info') !== -1).map(meta => {
		return (<TableRow>
			<TableCell sx={{ pr: 2, pl: 0, pt: 0, pb: 0, borderBottom: 'none' }}>
				<Typography
					sx={{ fontWeight: 'bold', fontSize: '1rem' }}
					variant='caption'>
					{meta.label}
				</Typography>
			</TableCell>
			<TableCell sx={{ p: 0, borderBottom: 'none' }}>
				<Typography
					sx={{ fontStyle: 'italic', fontSize: '1rem' }}
					variant='caption'>
					{metaToString(meta, app.currentMedia?.entry[meta.target])}
				</Typography>
			</TableCell>
		</TableRow>)
	});

	return (
		<Box
			sx={{
				position: 'absolute',
				top: 50,
				p: 2,
				left: 16,
				minWidth: '450px',
				borderRadius: 1,
				background: 'rgba(255, 255, 255, 0.6)'
			}}>
			<Typography variant='subtitle1' sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
				Media Details
			</Typography>
			<Table size='small'>
				<TableBody>
					<TableRow>
						<TableCell sx={{ pr: 2, pl: 0, pt: 0, pb: 0, borderBottom: 'none' }}>
							<Typography variant='caption' sx={{ fontWeight: 'bold', fontSize: '1rem' }}>Name</Typography>
						</TableCell>
						<TableCell sx={{ p: 0, borderBottom: 'none' }}>
							<Typography variant='caption' sx={{ fontStyle: 'italic', fontSize: '1rem' }}>
								{app.currentMedia?.entry.photo.name}
							</Typography>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell sx={{ pr: 2, pl: 0, pt: 0, pb: 0, borderBottom: 'none' }}>
							<Typography
								sx={{ fontWeight: 'bold', fontSize: '1rem' }}
								variant='caption'>
								Date modified
							</Typography>
						</TableCell>
						<TableCell sx={{ p: 0, borderBottom: 'none' }}>
							<Typography
								sx={{ fontStyle: 'italic', fontSize: '1rem' }}
								variant='caption'>
								{app.currentMedia?.dateModified &&
									new Date(app.currentMedia.dateModified).toLocaleString()}
							</Typography>
						</TableCell>
					</TableRow>

					{metaInfo}
				</TableBody>
			</Table>
		</Box>
	)
}

export default InfoPanel
