import "./App.css"
import ImageList from "@mui/material/ImageList"
import ImageListItemBar from "@mui/material/ImageListItemBar"
import IconButton from "@mui/material/IconButton"
import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined'
import ViewHeadlineOutlinedIcon from '@mui/icons-material/ViewHeadlineOutlined'
import DeleteOutline from '@mui/icons-material/DeleteOutline'
import EditOutlined from '@mui/icons-material/EditOutlined'
import { 
  Stack, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  useMediaQuery, 
  useTheme 
} from "@mui/material"
import SortableListItem from "./sortable-list-item"
import SortableTableRow from "./sortable-table-row"
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
  restrictToParentElement,
} from '@dnd-kit/modifiers'

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';

import { useEffect, useState } from "react";
import { ExtensionContextProvider } from "./extension-context";
import { ChApi, Folder } from "./ch-api";
import credentials from "./credentials";

const itemData = [
  {
    id: 12,
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
    author: "@bkristastucchio",
  },
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
    author: "@rollelflex_graphy726",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
    author: "@helloimnik",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
    author: "@nolanissac",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
    author: "@hjrc33",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
    author: "@arwinneil",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
    author: "@tjdragotta",
  },
  {
    id: 7,
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
    author: "@katie_wasserman",
  },
  {
    id: 8,
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
    author: "@silverdalex",
  },
  {
    id: 9,
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
    author: "@shelleypauls",
  },
  {
    id: 10,
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
    author: "@peterlaster",
  },
  {
    id: 11,
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
    author: "@southside_customs",
  },
]

function TitlebarBelowImageList() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))
  const isLarge = useMediaQuery(theme.breakpoints.down("lg"))
  const isXLarge = useMediaQuery(theme.breakpoints.down("xl"))
  let cols = 8
  if (isXLarge) cols = 7
  if (isLarge) cols = 5
  if (isLarge) cols = 5
  if (isTablet) cols = 3
  if (isMobile) cols = 2

  const [items, setItems] = useState(itemData);
  const [gridMode, setGridMode] = useState(true)
  const {clientId, clientSecret} = credentials;
  const [folders, setFolders] = useState<Folder[]>([])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    (async () => {
      if (clientId) {
        const gqlTest = new ChApi('https://auth.amplience.net/oauth/token', 'https://api.amplience.net/graphql');
        await gqlTest.auth(clientId, clientSecret);
        const result = await gqlTest.allReposWithFolders();
        console.log(result)
        setFolders(result[0].folders)
      }
    })();
  });

  const dragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)

      setItems(arrayMove(items, oldIndex, newIndex))
    }
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    setItems(newItems)
  };

  return (
    <ExtensionContextProvider>
      <Stack alignSelf={"end"} direction="row" spacing={2} mr={2} mt={2}>
        <IconButton
          sx={{ color: "white" }}
          aria-label={`select all`}
          onClick={() => setGridMode(false)}
        >
          <ViewHeadlineOutlinedIcon />
        </IconButton>
        <IconButton
          sx={{ color: "white" }}
          aria-label={`select all`}
          onClick={() => setGridMode(true)}
        >
          <AppsOutlinedIcon />
        </IconButton>
      </Stack>
      {gridMode ?
        <ImageList cols={cols} gap={8}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={dragEnd}
            modifiers={[restrictToWindowEdges, restrictToParentElement]}
          >
            <SortableContext items={items} strategy={rectSortingStrategy}>
              {items.map((item, index) => (
                <SortableListItem key={item.img} id={item.id} style={{position: 'relative'}}>
                  <img
                    src={`${item.img}?w=248&h=165&fit=crop&auto=format`}
                    srcSet={`${item.img}?w=248&h=165&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                    style={{display: 'block'}}
                  />
                  <IconButton
                    sx={{ color: "white", position: 'absolute', top: 0, right: 0 }}
                    aria-label={`edit`}
                  >
                    <EditOutlined />
                  </IconButton>
                  <IconButton
                    sx={{ color: "white", position: 'absolute', top: 0, left: 0 }}
                    aria-label={`delete`}
                    onClick={() => removeItem(index)}
                  >
                    <DeleteOutline />
                  </IconButton>
                  <ImageListItemBar
                    title={item.title}
                    subtitle={<span>by: {item.author}</span>}
                    position="below"
                    actionIcon={
                      <IconButton
                        sx={{ color: "white" }}
                        aria-label={`select ${item.title}`}
                      >
                        <CheckBoxOutlineBlank />
                      </IconButton>
                    }
                    actionPosition="left"
                  />
                </SortableListItem>
              ))}
            </SortableContext>
          </DndContext>
        </ImageList>
        :
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={dragEnd}
          modifiers={[restrictToVerticalAxis, restrictToWindowEdges, restrictToParentElement]}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell component="th">
                    <IconButton
                      sx={{ color: "white" }}
                      aria-label={`select all`}
                    >
                      <CheckBoxOutlineBlank />
                    </IconButton>
                  </TableCell>
                  <TableCell component="th">
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} component="th">Media</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} component="th" align="left">Title</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} component="th" align="left">Author</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} component="th" align="left">Edit</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} component="th" align="left">Delete</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item: any, index: number) => (
                  <SortableTableRow 
                    key={item.img} 
                    id={item.id} 
                    handle={true} 
                    item={item} 
                    removeItem={removeItem} 
                    index={index} 
                  />
                ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      }
      {
        folders &&
        <RichObjectTreeView folders={folders}/>
      }
    </ExtensionContextProvider >
  )
}

function RichObjectTreeView(props: any) {
  const renderTree = (node: Folder) => (
    <TreeItem key={node.id} nodeId={node.id} label={node.label}>
      {Array.isArray(node.children)
        ? node.children.map((childNode) => renderTree(childNode))
        : null}
    </TreeItem>
  );
  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={['root']}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      <TreeItem nodeId="root" label="Content Hub">
        {props.folders.map((folder: Folder) => renderTree(folder))}
      </TreeItem>
    </TreeView>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TitlebarBelowImageList />
      </header>
    </div>
  )
}

export default App