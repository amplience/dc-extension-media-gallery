import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import ImageListItem from '@mui/material/ImageListItem';

export default function SortableListItem(props: any) {
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
    <ImageListItem ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </ImageListItem>
  );
}