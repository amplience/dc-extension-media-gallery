import { areArraysEqual } from '@mui/base'
import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { TreeItem, TreeView } from '@mui/lab'
import { useEffect, useRef, useState } from 'react'
import { Folder } from '../ch-api/shared'
import { FormControl, InputLabel, MenuItem, Popover, Select } from '@mui/material'

/**
 * Builds out the list of expanded nodes in the tree view, given a selected ID.
 * @param node Current node
 * @param id ID to expand to
 * @param list List of expanded nodes
 * @returns Boolean
 */
const buildExpanded = (node: any, id: string, list: string[]): boolean => {
	if (node.id === id) {
		list.splice(1, 0, node.id)
		return true
	}

	if (Array.isArray(children(node))) {
		for (let child of children(node)) {
			if (buildExpanded(child, id, list)) {
				list.splice(1, 0, node.id)
				return true
			}
		}
	}

	return false
}

/**
 * Find an item with a given ID either in the given items or their children.
 * @param nodes List of nodes to search
 * @param id ID to search for
 * @returns Child node | undefined
 */
const findItem = (nodes: any, id: string): any => {
	if (Array.isArray(nodes)) {
		for (let node of nodes) {
			if (node.id === id) {
				return node
			}

			const child = findItem(children(node), id)

			if (child != null) {
				return child
			}
		}
	}

	return undefined
}

/**
 * Get the children of a given node (repo/folder)
 * @param collection List of child nodes
 * @returns Children | Folders from collection
 */
const children = (collection: any) => {
	return collection.children ?? collection.folders
}

/**
 * Select component where the options are displayed on a tree.
 * @param props Comonent props, including selected id and the tree containing the nodes.
 * @returns RichObjectTreeView Component
 */
const RichObjectTreeView = (props: any) => {
	const [expanded, setExpanded] = useState(['root'])
	const [sequenceNumber, setSequenceNumber] = useState(0)
	const [open, setOpen] = useState(false)

	const popoverAnchor = useRef()

	/**
	 * Recalculate the expanded folders when the selectedId prop or tree changes.
	 */
	useEffect(() => {
		if (props.selectedId) {
			const newExpanded = ['root']
			for (const folder of children(props)) {
				buildExpanded(folder, props.selectedId, newExpanded)
			}

			if (!areArraysEqual(expanded, newExpanded)) {
				setSequenceNumber(sequenceNumber + 1)
				setExpanded(newExpanded)
			}
		}
	}, [props.selectedId, children(props), sequenceNumber, expanded])

	/**
	 * Opens the popover containing the tree.
	 */
	const openPopover = () => {
		setOpen(true)
	}

	/**
	 * Closes the popover containing the tree.
	 */
	const closePopover = () => {
		setOpen(false)
	}

	/**
	 * Renders the tree of nodes recursively.
	 * @param node The current node
	 * @returns Tree item
	 */
	const renderTree = (node: any) => (
		<TreeItem key={node.id} nodeId={node.id} label={node.label}>
			{Array.isArray(children(node))
				? children(node).map((childNode: any) => renderTree(childNode))
				: null}
		</TreeItem>
	)

	const selected = findItem(children(props), props.selectedId)

	return (
		<FormControl style={{ width: '100%' }}>
			<InputLabel id='asset-folder-label'>Asset Folder</InputLabel>
			<Select
				id='asset-folder-label'
				label='Asset Folder'
				size='small'
				open={false}
				onOpen={openPopover}
				ref={popoverAnchor}
				value={selected ? props.selectedId : ''}>
				<MenuItem value='none'>None</MenuItem>
				(selected && <MenuItem value={props.selectedId}>{selected?.label}</MenuItem>)
			</Select>
			<Popover
				open={open}
				anchorEl={popoverAnchor?.current}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				onClose={closePopover}>
				<TreeView
					key={sequenceNumber}
					aria-label='rich object'
					defaultCollapseIcon={<ExpandMore />}
					defaultExpanded={expanded}
					defaultExpandIcon={<ChevronRight />}
					defaultSelected={props.selectedId}
					style={{ flexGrow: 1, maxWidth: '400px', padding: '10px' }}
					onNodeSelect={(event: React.SyntheticEvent, nodeId: string) => {
						if (props.onChange) {
							props.onChange(nodeId)
						}
					}}>
					<TreeItem nodeId='root' label='Content Hub'>
						{children(props).map((folder: Folder) => renderTree(folder))}
					</TreeItem>
				</TreeView>
			</Popover>
		</FormControl>
	)
}

export default RichObjectTreeView
