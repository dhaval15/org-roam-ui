import { 
	Button,
} from '@chakra-ui/react'

export function TextButton(props: any) {
	const {label, onClick} = props
	return (
		<Button
			variant="ghost"
			colorScheme="whiteAlpha"
			color="black"
			onClick={onClick}
			_hover={{
				borderWidth: 0,
				bg: 'black',
				color: 'white',
			}}
			_active={{
				borderWidth: 0,
				bg: 'black',
				color: 'white',
				transform: 'scale(0.9)',
			}}
			_focus={{
				borderWidth: 0,
				bg: 'black',
				color: 'white',
				transform: 'scale(0.95)',
			}}
		>
			{label}
		</Button>
	)
}
