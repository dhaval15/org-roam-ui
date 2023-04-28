import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { TextButton } from './extras'
import {
  Box,
  Menu,
  MenuItem,
  MenuList,
  MenuGroup,
  MenuItemOption,
  MenuOptionGroup,
  Heading,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  PopoverTrigger,
  PopoverContent,
  Popover,
  Flex,
  PopoverBody,
  PopoverCloseButton,
  PopoverArrow,
  PopoverHeader,
  PopoverFooter,
  Portal,
  Text,
  VStack,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogBody,
	Stack,
	Input,
	FormLabel,
	Textarea,
	Wrap,
	WrapItem,
	Center,
} from '@chakra-ui/react'
import {
  DeleteIcon,
  EditIcon,
  CopyIcon,
  AddIcon,
  ViewIcon,
	LinkIcon,
  ExternalLinkIcon,
  ChevronRightIcon,
  PlusSquareIcon,
  MinusIcon,
} from '@chakra-ui/icons'

import { OrgRoamGraphReponse, OrgRoamLink, OrgRoamNode } from '../api'
import { deleteNodeInEmacs, openNodeInEmacs, createNodeInEmacs } from '../util/webSocketFunctions'
import { BiNetworkChart } from 'react-icons/bi'
import { TagMenu } from './TagMenu'
import { initialFilter, TagColors } from './config'

export default interface ReviewMenuProps {
  background: Boolean
  text: string
  coordinates: { [direction: string]: number | undefined }
  menuClose: () => void
  onOpenReviewDialog: () => void
}

export const ReviewMenu = (props: ReviewMenuProps) => {
  const {
    background,
    text,
    coordinates,
    menuClose,
		onOpenReviewDialog,
  } = props
  return (
    <>
      <Menu defaultIsOpen closeOnBlur={false} onClose={() => menuClose()}>
        <MenuList
          zIndex="overlay"
          bgColor="white"
          color="black"
          //borderColor="gray.500"
          position="absolute"
          left={coordinates.left}
          top={coordinates.top}
          right={coordinates.right}
          bottom={coordinates.bottom}
          fontSize="xs"
          boxShadow="xl"
        >
					<>
							<>
								<Heading size="xs" isTruncated px={3} py={1}>
									Actions
								</Heading>
								<MenuDivider borderColor="gray.500" />
							</>

						<MenuItem
							icon={<ViewIcon />}
							onClick={() => {
								setPreviewNode(target)
							}}
						>
							Preview
						</MenuItem>
						<MenuItem
							icon={<LinkIcon />}
							onClick={() => {
								onOpenReviewDialog()
							}}
						>
							Review
						</MenuItem>
					</>
        </MenuList>
      </Menu>
    </>
  )
}

export type ReviewDialogProps = {
	disclosure: any,
	onSave: (string, string) => void,
}

export function ReviewDialog(props) {
	const { disclosure, onSave } = props
	const cancelRef = useRef<any>()
	const [feedback, setFeedback] = useState('')
	const colors = ['red', 'green', 'tomato', 'teal', 'brown']
	const [color, setColor] = useState(colors[0])
	return (
		<AlertDialog
			motionPreset="slideInBottom"
			isOpen={disclosure.isOpen}
			leastDestructiveRef={cancelRef}
			onClose={disclosure.onClose}
			isCenterd
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize='lg' fontWeight='bold'>
						Add Review
					</AlertDialogHeader>

					<AlertDialogBody>
							<Stack spacing={2}>
								<FormLabel>Feedback</FormLabel>
								<Textarea
									rows={2}
									value={feedback} 
									onChange={(event) => {
										setFeedback(event.target.value)
									}}
									variant="filled"/>
								<FormLabel>Color</FormLabel>
								<SelectColor
									colors={colors}
									value={color}
									onChange={setColor}
									variant="filled"/>
							</Stack>
					</AlertDialogBody>

					<AlertDialogFooter>
						<TextButton 
							ref={cancelRef} 
							onClick={disclosure.onClose}
							label="Cancel"/>
						<Button 
							colorScheme="green"
							onClick={() => {
								onSave(feedback, color)
							}} 
							ml={3}>
							Save
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	)
}

export type SelectColorProps = {
	colors: string[]
	value: string
	onChange: (string) => void
}

export function SelectColor(props) {
	const { colors, value, onChange } = props

	return (
			<Wrap templateColumns='repeat(2, 1fr)'>
				{colors.map(color => (
					<WrapItem>
						<Center
							as="button"
							width="28px"
							height="28px"
							bg={color}
							onClick={() => {
								onChange(color)
							}}
							style={{
								borderColor: 'white',
								borderWidth: value == color ? 2 : 0,
								borderRadius: 8,
							}}
							borderColor="white"
							/>
					</WrapItem>
				))}
			</Wrap>
	)
}
