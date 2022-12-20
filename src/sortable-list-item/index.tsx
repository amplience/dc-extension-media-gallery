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
    isDragging,
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? "100" : "auto",
  };
  
  return (
    <ImageListItem ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.children}
    </ImageListItem>
  );
}