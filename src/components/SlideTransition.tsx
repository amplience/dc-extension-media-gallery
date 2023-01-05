import { SlideProps, Slide } from '@mui/material'

const SlideTransition = (props: SlideProps) => {
	return <Slide {...props} direction='down' />
}

export default SlideTransition
