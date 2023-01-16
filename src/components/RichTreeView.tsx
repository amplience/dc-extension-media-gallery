import { areArraysEqual } from '@mui/base'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { TreeItem, TreeView } from '@mui/lab'
import { useEffect, useState } from 'react'
import { Folder } from '../ch-api/shared'

const buildExpanded = (node: any, id: string, list: string[]): boolean => {
	if (node.id === id) {
		list.splice(1, 0, node.id);
		return true;
	}

	if (Array.isArray(node.children)) {
		for (let child of node.children) {
			if (buildExpanded(child, id, list)) {
				list.splice(1, 0, node.id);
				return true;
			}
		}
	}

	return false;
}

const RichObjectTreeView = (props: any) => {
	const [expanded, setExpanded] = useState(['root']);
	const [sequenceNumber, setSequenceNumber] = useState(0);

	useEffect(() => {
		if (props.selectedId) {
			const newExpanded = ['root']
			for (const folder of props.folders) {
				buildExpanded(folder, props.selectedId, newExpanded);
			}

			if (!areArraysEqual(expanded, newExpanded)) {
				setSequenceNumber(sequenceNumber + 1);
				setExpanded(newExpanded);
			}
		}
	}, [props.selectedId, props.folders, sequenceNumber, expanded])

	const renderTree = (node: any) => (
		<TreeItem key={node.id} nodeId={node.id} label={node.label}>
			{Array.isArray(node.children)
				? node.children.map((childNode: any) => renderTree(childNode))
				: null}
		</TreeItem>
	)
	return (
		<TreeView
			key={sequenceNumber}
			aria-label='rich object'
			defaultCollapseIcon={<ExpandMore />}
			defaultExpanded={expanded}
			defaultExpandIcon={<ChevronRight />}
			defaultSelected={props.selectedId}
			style={{ flexGrow: 1, maxWidth: '400px' }}
			onNodeSelect={(event: React.SyntheticEvent, nodeId: string) => {
				if (props.onChange) {
					props.onChange(nodeId)
				}
			}}>
			<TreeItem nodeId='root' label='Content Hub'>
				{props.folders.map((folder: Folder) => renderTree(folder))}
			</TreeItem>
		</TreeView>
	)
}

export default RichObjectTreeView
