import React from 'react'
import Head from 'next/head'
import { OrgView } from '../components/Sidebar'
import {
	Flex,
	Center,
	Button,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogBody,
  useDisclosure,
  useOutsideClick,
} from '@chakra-ui/react'
import useUndo from 'use-undo'
import { usePersistantState } from '../util/persistant-state'
import { 
	useEffect,
	useState,
	useRef,
} from 'react'
import {
  initialFilter,
} from '../components/config'
import axios from 'axios'
import { OrgRoamGraphReponse, OrgRoamLink, OrgRoamNode } from '../api'
import { orgroamApi, extraApi } from '../api/api'
import { ReviewMenu, ReviewDialog} from '../components/reviewmenu'
import { findSelections, insertReview} from '../util/review'

export type NodeById = { [nodeId: string]: OrgRoamNode | undefined }
export type LinksByNodeId = { [nodeId: string]: OrgRoamLink[] | undefined }
export type NodeByCite = { [key: string]: OrgRoamNode | undefined }

export default function Document({data}) {
  const [showPage, setShowPage] = useState(false)
  useEffect(() => {
    setShowPage(true)
  }, [])

  if (!showPage) {
    return null
  }
	return (
		<>
			<Head>
				<title>Axon</title>
			</Head>
			<Center>
				<div 
					style={{
						maxWidth: 900,
						flex: 1,
					}}>
					<DocumentView 
						id={data.id}
					/>
				</div>
			</Center>

		</>
	)
}
export interface DocumentViewProps {
	id: string
}

export const SelectionContext = React.createContext();

export function DocumentView(props) {
	const {
		id
	} = props
  const [
    previewNodeState,
    {
      set: setPreviewNode,
      reset: resetPreviewNode,
      undo: previousPreviewNode,
      redo: nextPreviewNode,
      canUndo,
      canRedo,
    },
  ] = useUndo<NodeObject>({})
  const {
    past: pastPreviewNodes,
    present: previewNode,
    future: futurePreviewNodes,
  } = previewNodeState

	const [sidebarHighlightedNode, setSidebarHighlightedNode] = useState<OrgRoamNode | null>(null)
  const [tagColors, setTagColors] = usePersistantState<TagColors>('tagCols', {})
  const [filter, setFilter] = usePersistantState('filter', initialFilter)
  const nodeByIdRef = useRef<NodeById>({})
  const linksByNodeIdRef = useRef<LinksByNodeId>({})
  const nodeByCiteRef = useRef<NodeByCite>({})

  type ContextPos = {
    left: number | undefined
    right: number | undefined
    top: number | undefined
    bottom: number | undefined
  }

  const [contextPos, setContextPos] = useState<ContextPos>({
    left: 0,
    top: 0,
    right: undefined,
    bottom: undefined,
  })
  const [contextMenuText, setContextMenuText] = useState<string | null>(null)

  const openReviewMenu = (text: string, event: any, coords?: ContextPos) => {
    coords
      ? setContextPos(coords)
      : setContextPos({ left: event.pageX, top: event.pageY, right: undefined, bottom: undefined })
    setContextMenuText(text)
    contextMenu.onOpen()
  }

  const contextMenuRef = useRef<any>()

  const contextMenu = useDisclosure()
  const reviewDialog = useDisclosure()

  useOutsideClick({
    ref: contextMenuRef,
    handler: () => {
      contextMenu.onClose()
    },
  })

	const onSave = async (feedback: string, color: string) => {
		let content = await orgroamApi.read(id)
		let selections = findSelections(content, contextMenuText)
		if (selections.length == 1) {
			let selection = selections[0]
			console.log(id)
			let review : Review = {
				node: id,
				start: selection.start,
				end: selection.end,
				color: color,
				content: selection.content,
				feedback: feedback,
			}
			let reviewId = await extraApi.insertReview(review)
			review.id = reviewId
			//state.content = insertReview(state.content!, review)
			// return {
			// 	review: review,
			// 	content: state.content,
			// }
		}
	}

  useEffect(() => {
		axios.get(`/orgroam/nodes/${id}`).then((response) => {
			setPreviewNode(response.data as OrgRoamNode)
		})
  }, [id])
	return (
		<>
			<SelectionContext.Provider value={{openReviewMenu}}>
				<OrgView
					{...{
						previewNode,
						setPreviewNode,
						canUndo,
						canRedo,
						previousPreviewNode,
						nextPreviewNode,
						resetPreviewNode,
						setSidebarHighlightedNode,
						tagColors,
						setTagColors,
						filter,
						setFilter,
						//openContextMenu,
					}}
					macros={ {} }
					attachDir={''}
					useInheritance={false}
					nodeById={nodeByIdRef.current!}
					linksByNodeId={linksByNodeIdRef.current!}
					nodeByCite={nodeByCiteRef.current!}
				/>
			</SelectionContext.Provider>
			{contextMenu.isOpen && (
				<div ref={contextMenuRef}>
					<ReviewMenu
						text={contextMenuText.current}
						background={false}
						coordinates={contextPos}
						menuClose={contextMenu.onClose.bind(contextMenu)}
						onOpenReviewDialog={reviewDialog.onOpen}
					/>
				</div>
			)}
			<ReviewDialog
				disclosure={reviewDialog}
				onSave={onSave}
				/>
		</>
	)
}

export async function getServerSideProps({query}) {
  const id = query.id
	const data = {
		id : id
	}
  return { props: { data } }
}
