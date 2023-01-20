import { areArraysEqual } from "@mui/base";
import { ExpandMore, ChevronRight } from "@mui/icons-material";
import { TreeItem, TreeView } from "@mui/lab";
import { useEffect, useRef, useState } from "react";
import { Folder } from "../ch-api/shared";
import { FormControl, InputLabel, MenuItem, Popover, Select } from "@mui/material";

const buildExpanded = (node: any, id: string, list: string[]): boolean => {
  if (node.id === id) {
    list.splice(1, 0, node.id);
    return true;
  }

  if (Array.isArray(children(node))) {
    for (let child of children(node)) {
      if (buildExpanded(child, id, list)) {
        list.splice(1, 0, node.id);
        return true;
      }
    }
  }

  return false;
};

const findItem = (nodes: any, id: string): any => {
  if (Array.isArray(nodes)) {
    for (let node of nodes) {
      if (node.id === id) {
        return node;
      }

      const child = findItem(children(node), id);

      if (child != null) {
        return child;
      }
    }
  }

  return undefined;
}

const children = (collection: any) => {
  return collection.children ?? collection.folders;
}

const RichObjectTreeView = (props: any) => {
  const [expanded, setExpanded] = useState(["root"]);
  const [sequenceNumber, setSequenceNumber] = useState(0);
  const [open, setOpen] = useState(false);

  const popoverAnchor = useRef();

  useEffect(() => {
    if (props.selectedId) {
      const newExpanded = ["root"];
      for (const folder of children(props)) {
        buildExpanded(folder, props.selectedId, newExpanded);
      }

      if (!areArraysEqual(expanded, newExpanded)) {
        setSequenceNumber(sequenceNumber + 1);
        setExpanded(newExpanded);
      }
    }
  }, [props.selectedId, children(props), sequenceNumber, expanded]);

  const openPopover = () => {
    setOpen(true);
  };

  const closePopover = () => {
    setOpen(false);
  };

  const renderTree = (node: any) => (
    <TreeItem key={node.id} nodeId={node.id} label={node.label}>
      {Array.isArray(children(node))
        ? children(node).map((childNode: any) => renderTree(childNode))
        : null}
    </TreeItem>
  );

  const selected = findItem(children(props), props.selectedId);

  return (
    <FormControl style={{width: '100%'}}>
      <InputLabel id="asset-folder-label">Asset Folder</InputLabel>
      <Select
        id="asset-folder-label"
        label="Asset Folder"
        size="small"
        open={false}
        onOpen={openPopover}
        ref={popoverAnchor}
        value={selected ? props.selectedId : ''}
      >
        <MenuItem value='none'>None</MenuItem>
        (selected && <MenuItem value={props.selectedId}>{selected?.label}</MenuItem>)
      </Select>
      <Popover
        open={open}
        anchorEl={popoverAnchor?.current}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        onClose={closePopover}
      >
        <TreeView
          key={sequenceNumber}
          aria-label="rich object"
          defaultCollapseIcon={<ExpandMore />}
          defaultExpanded={expanded}
          defaultExpandIcon={<ChevronRight />}
          defaultSelected={props.selectedId}
          style={{ flexGrow: 1, maxWidth: "400px", padding: '10px' }}
          onNodeSelect={(event: React.SyntheticEvent, nodeId: string) => {
            if (props.onChange) {
              props.onChange(nodeId);
            }
          }}
        >
          <TreeItem nodeId="root" label="Content Hub">
            {children(props).map((folder: Folder) => renderTree(folder))}
          </TreeItem>
        </TreeView>
      </Popover>
    </FormControl>
  );
};

export default RichObjectTreeView;
