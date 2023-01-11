import { ExpandMore, ChevronRight } from '@mui/icons-material'
import { TreeItem, TreeView } from '@mui/lab'
import { Folder } from '../ch-api/shared'

const RichObjectTreeView = (props: any) => {
	const renderTree = (node: any) => (
		<TreeItem key={node.id} nodeId={node.id} label={node.label}>
			{Array.isArray(node.children)
				? node.children.map((childNode: any) => renderTree(childNode))
				: null}
		</TreeItem>
	)
	return (
		<TreeView
			aria-label='rich object'
			defaultCollapseIcon={<ExpandMore />}
			defaultExpanded={['root']}
			defaultExpandIcon={<ChevronRight />}
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
