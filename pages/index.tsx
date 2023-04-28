import React, {useRef, useState} from 'react'
import Head from 'next/head'
import axios from 'axios'
import { reviewApi } from '../api/api'
import { useRouter } from 'next/router'
import { TextButton } from '../components/extras'
import { 
	Box,
	Button,
	Card,
	CardHeader, 
	CardBody, 
	CardFooter,
	Text,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogBody,
	FormLabel,
	Input,
	Stack,
	HStack,
	Flex,
	Spacer,
	Grid,
	GridItem,
	Code,
	useDisclosure,
} from '@chakra-ui/react'

export default function Index({data}) {
	const [views, setViews] = useState([])
  reviewApi.views().then((views) => {
		setViews(views)
	})

	function onViewAdded(view: View) {
		setViews([ view, ...views])
	}

	return (
		<>
			<Head>
				<title> Axon </title>
			</Head>
			<Grid templateColumns='repeat(3, 1fr)'>
				<GridItem>
					<ViewTile view={null}/>
				</GridItem>
				{views.map(view => (
					<GridItem>
						<ViewTile view={view}/>
					</GridItem>
				))}
			</Grid>
			<AddViewDialog onViewAdded={onViewAdded}/>
		</>
	)
}

export type View = {
	id?: string
	name: string
	query: string
}

export function ViewTile(props) {
	const { view, onViewAdded } = props
	const urlQuery = view?.id != null ? `?view=${view?.id}` : ''
	const router = useRouter()
	return (
		<Box
			//as="button"
			bg="alt.100"
			borderWidth={0}
			boxShadow="4px 4px 30px 12px rgba(0, 0, 0, .1)"
			borderRadius={12}
			margin={4}
			padding={4}>
			<Text
				style={{
					fontSize: 28,
					fontWeight: 'semi-bold',
					color: 'white'
				}}>
				{view?.name ?? 'Home'}
			</Text>
			<Flex marginTop="16px" spacing="4px"> 
				<Spacer/>
				<TextButton
					onClick={() => {
						router.push(`/nodes${urlQuery}`)
					}}
					label="Nodes"/>
				<TextButton
					onClick={() => {
						router.push(`/neuron${urlQuery}`)
					}}
					label="Network"/>
				<TextButton
					onClick={() => {
						router.push(`/todos${urlQuery}`)
					}}
					label="Todos"/>
			</Flex>
		</Box>
	)
}

export function AddViewDialog(props) {
	const { onViewAdded } = props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef<any>()
	const [name, setName] = useState('')
	const [query, setQuery] = useState()
	const onNameChange = (event) => setName(event.target.value)
	const onQueryChange = (event) => setQuery(event.target.value)
	function saveView() {
		const view = {
			name: name,
			query: query,
		}
		axios.post(`/review/views`, view).then((response) => {
				console.log(response)
				onViewAdded({
					id: response.data.id,
					name: view.name,
					query: view.query,
				})
				onClose()
		})
	} 
  return (
    <>
			<Flex>
				<Spacer/>
				<TextButton 
					onClick={onOpen} 
					label="Add View"/>
				<Box width="16px"/>
			</Flex>
			<AlertDialog
				motionPreset="slideInBottom"
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
				isCenterd
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Add View
            </AlertDialogHeader>

            <AlertDialogBody>
							<Stack spacing={2}>
								<FormLabel>Name</FormLabel>
								<Input 
									value={name} 
									onChange={onNameChange}
									variant="filled"/>
								<FormLabel>Query</FormLabel>
								<Input 
									value={query} 
									rows={3}
									onChange={onQueryChange}
									variant="filled"/>
							</Stack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <TextButton 
								ref={cancelRef} 
								onClick={onClose}
                label="Cancel"/>
              <Button colorScheme="green" onClick={saveView} ml={3}>
                Save
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
		</>
	)
}

