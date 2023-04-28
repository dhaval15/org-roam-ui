import { Scrollbars } from 'react-custom-scrollbars-2'
import React, {
  useEffect,
  useRef,
  useState,
} from 'react'
import Head from 'next/head'
import {
	Box,
	Stack,
	List,
	ListItem,
	Text,
	Link,
	Heading,
} from '@chakra-ui/react'
import axios from 'axios'

export default function Nodes({ data }) {
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
				<title> Nodes </title>
			</Head>
			<NodesPage view={data.view}/>
		</>
	)
}

export function NodesPage(props: any) {
	const {view} = props
	const [nodes, setNodes] = useState([])
	useEffect(() => {	
		const url = view != null ? `/orgroam/nodes?view=${view}` : '/orgroam/nodes'
		axios.get(url)
			.then((response) => {
				setNodes(response.data)
		})
	})
	return (
		<Stack 
			padding="24px" 
			overflow="scroll"
			spacing="8px">
					<Heading> Nodes </Heading>
					<br/>
					{nodes.map(node => (
						<>
							<NodeTile node={node}/>
						</>
					))}
		</Stack>
	)
}

export function NodeTile(props: any) {
	const { node } = props
	return (
		<Link 
			style={{
				fontSize: 24,
				//color: 'yellow',
			}}
			href={`/document?id=${node.id}`}
			>
			{node.title}
		</Link>
	)
}


export async function getServerSideProps({query}) {
  const view = query.view
	const data = {
		view : view ?? null
	}
  return { props: { data } }
}
