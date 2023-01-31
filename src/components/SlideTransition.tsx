import { SlideProps, Slide } from '@mui/material'

const SlideTransition = (props: SlideProps) => {
	return <Slide {...props} direction='up' />
}

export default SlideTransition
