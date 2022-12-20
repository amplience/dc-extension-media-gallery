import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { Button, IconButton, TableCell, TableRow } from '@mui/material';
import { CheckBoxOutlineBlank, DeleteOutline, EditOutlined, DragIndicatorOutlined, VisibilityOutlined } from '@mui/icons-material';
export default function SortableTableRow(props: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? "100" : "auto",
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
        <DragIndicatorOutlined className='dragHandle' sx={{ color: "white" }} {...listeners} {...attributes} />
      </TableCell>
      <TableCell>
        <img
          src={`${props.item.img}?w=124&h=82&fit=crop&auto=format`}
          srcSet={`${props.item.img}?w=124&h=82&fit=crop&auto=format&dpr=2 2x`}
          alt={props.item.title}
          loading="lazy"
          {...listeners} {...attributes}
        />
      </TableCell>
      <TableCell sx={{ color: "white" }} align="left">{props.item.title}</TableCell>
      <TableCell sx={{ color: "white" }} align="left">{props.item.author}</TableCell>
      <TableCell align="left">
        <IconButton
          sx={{ color: "white" }}
          aria-label={`edit`}
        >
          <VisibilityOutlined />
        </IconButton>
        <IconButton
          sx={{ color: "white" }}
          aria-label={`edit`}
        >
          <EditOutlined />
        </IconButton>
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