import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { Button, IconButton, TableCell, TableRow } from '@mui/material';
import { CheckBoxOutlineBlank, DeleteOutline, EditOutlined, DragHandleOutlined } from '@mui/icons-material';
export default function SortableTableRow(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <IconButton
          sx={{ color: "white" }}
          aria-label={`select`}
        >
          <CheckBoxOutlineBlank />
        </IconButton>
      </TableCell>
      <TableCell>
        <DragHandleOutlined sx={{ color: "white" }} {...listeners} {...attributes} />
      </TableCell>
      <TableCell>
        <img
          src={`${props.item.img}?w=124&h=82&fit=crop&auto=format`}
          srcSet={`${props.item.img}?w=124&h=82&fit=crop&auto=format&dpr=2 2x`}
          alt={props.item.title}
          loading="lazy"
        />
      </TableCell>
      <TableCell sx={{ color: "white" }} align="left">{props.item.title}</TableCell>
      <TableCell sx={{ color: "white" }} align="left">{props.item.author}</TableCell>
      <TableCell align="left">
        <IconButton
          sx={{ color: "white" }}
          aria-label={`edit`}
        >
          <EditOutlined />
        </IconButton>
      </TableCell>
      <TableCell align="left">
        <IconButton
          sx={{ color: "white" }}
          aria-label={`delete`}
          onClick={() => props.removeItem(props.index)}
        >
          <DeleteOutline />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}