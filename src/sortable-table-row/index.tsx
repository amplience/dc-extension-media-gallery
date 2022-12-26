import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { TableRow } from '@mui/material';
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
    opacity: isDragging ? 0.5 : 1
  };
  
  return (
    <TableRow ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </TableRow>
  );
}