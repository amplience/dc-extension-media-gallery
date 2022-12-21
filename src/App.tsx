import "./App.css"
import ImageList from "@mui/material/ImageList"
import ImageListItemBar from "@mui/material/ImageListItemBar"
import IconButton from "@mui/material/IconButton"
import {
  CheckBoxOutlineBlank,
  AppsOutlined,
  EditOutlined,
  DeleteOutline,
  ViewHeadlineOutlined,
  SortOutlined,
  CachedOutlined,
  AddPhotoAlternateOutlined,
  VisibilityOutlined
} from "@mui/icons-material";
import {
  Stack,
  SwipeableDrawer,
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
} from "@dnd-kit/modifiers";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TreeItem from "@mui/lab/TreeItem";

import { useEffect, useState } from "react";
import { ExtensionContextProvider } from "./extension-context";
import { ChApi, Folder, EnrichedRepository } from "./ch-api";
import credentials from "./credentials";
import { convertToEntry, defaultExifMap } from "./model/conversion";

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
];

function TitlebarBelowImageList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isLarge = useMediaQuery(theme.breakpoints.down("lg"));
  const isXLarge = useMediaQuery(theme.breakpoints.down("xl"));
  let cols = 8;
  if (isXLarge) cols = 7;
  if (isLarge) cols = 5;
  if (isLarge) cols = 5;
  if (isTablet) cols = 3;
  if (isMobile) cols = 2;

  const [items, setItems] = useState(itemData);
  const [gridMode, setGridMode] = useState(true);
  const [repo, setRepo] = useState<EnrichedRepository>();
  const [chApi, setChApi] = useState<ChApi>();
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [importDrawerOpen, setImportDrawerOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getEntries = async (id: string) => {
    if (chApi && repo) {
      const assets = await chApi.getExifByFolder(repo.id, id);

      const entries = assets.map((asset) =>
        convertToEntry(asset, defaultExifMap, {
          endpoint: "nmrsaalphatest",
          defaultHost: "cdn.media.amplience.net",
        })
      );

      console.log(entries);
    }
  };

  useEffect(() => {
    (async () => {
      const { clientId, clientSecret } = credentials;

      if (clientId) {
        const gqlTest = new ChApi(
          "https://auth.amplience.net/oauth/token",
          "https://api.amplience.net/graphql"
        );
        await gqlTest.auth(clientId, clientSecret);
        setChApi(gqlTest);

        const result = await gqlTest.allReposWithFolders();
        console.log(result);
        setRepo(result[0]);
      }
    })();
  }, []);

  const dragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <ExtensionContextProvider>
      <Stack alignSelf={"end"} direction="row" spacing={2} mr={2} mt={2}>
        <IconButton
          sx={{ color: "white" }}
          aria-label={`import`}
          onClick={() => setImportDrawerOpen(true)}
        >
          <AddPhotoAlternateOutlined />
        </IconButton>
        <IconButton
          sx={{ color: "white" }}
          aria-label={`sync`}
        >
          <CachedOutlined />
        </IconButton>
        <IconButton
          sx={{ color: "white" }}
          aria-label={`sort`}
        >
          <SortOutlined />
        </IconButton>
        {
          gridMode &&
          <IconButton
            sx={{ color: "white" }}
            aria-label={`list mode`}
            onClick={() => setGridMode(false)}
          >
            <ViewHeadlineOutlined />
          </IconButton>
        }
        {!gridMode &&
          <IconButton
            sx={{ color: "white" }}
            aria-label={`grid mode`}
            onClick={() => setGridMode(true)}
          >
            <AppsOutlined />
          </IconButton>
        }
      </Stack>
      {gridMode ? (
        <ImageList cols={cols} gap={8}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={dragEnd}
            modifiers={[restrictToWindowEdges, restrictToParentElement]}
          >
            <SortableContext items={items} strategy={rectSortingStrategy}>
              {items.map((item, index) => (
                <SortableListItem
                  key={item.img}
                  id={item.id}
                  style={{ position: "relative" }}
                >
                  <img
                    src={`${item.img}?w=248&h=165&fit=crop&auto=format`}
                    srcSet={`${item.img}?w=248&h=165&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                    style={{ display: "block" }}
                  />
                  <IconButton
                    sx={{
                      color: "white",
                      position: "absolute",
                      top: 0,
                      left: 0,
                    }}
                    aria-label={`edit`}
                    onClick={() => setDetailDrawerOpen(true)}
                  >
                    <EditOutlined />
                  </IconButton>
                  <IconButton
                    sx={{
                      color: "white",
                      position: "absolute",
                      top: 0,
                      right: 0,
                    }}
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
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={dragEnd}
          modifiers={[
            restrictToVerticalAxis,
            restrictToWindowEdges,
            restrictToParentElement,
          ]}
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
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} component="th">Media</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} component="th" align="left">Title</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} component="th" align="left">Author</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} component="th" align="left">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item: any, index: number) => (
                  <SortableTableRow
                    key={item.img}
                    id={item.id}>
                    <TableCell>
                      <IconButton
                        sx={{ color: "white" }}
                        aria-label={`select`}
                      >
                        <CheckBoxOutlineBlank />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <img
                        src={`${item.img}?w=124&h=82&fit=crop&auto=format`}
                        srcSet={`${item.img}?w=124&h=82&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.title}
                        loading="lazy"
                      />
                    </TableCell>
                    <TableCell sx={{ color: "white" }} align="left">{item.title}</TableCell>
                    <TableCell sx={{ color: "white" }} align="left">{item.author}</TableCell>
                    <TableCell align="left">
                      <IconButton
                        sx={{ color: "white" }}
                        aria-label={`edit`}
                        onClick={() => setDetailDrawerOpen(true)}
                      >
                        <VisibilityOutlined />
                      </IconButton>
                      <IconButton
                        sx={{ color: "white" }}
                        aria-label={`edit`}
                        onClick={() => setDetailDrawerOpen(true)}
                      >
                        <EditOutlined />
                      </IconButton>
                      <IconButton
                        sx={{ color: "white" }}
                        aria-label={`delete`}
                        onClick={() => removeItem(index)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </TableCell>
                  </SortableTableRow>
                ))}
              </TableBody>
            </Table>
          </SortableContext>
        </DndContext>
      )}
      <SwipeableDrawer 
        anchor={"right"} 
        open={detailDrawerOpen} 
        onClose={() => setDetailDrawerOpen(false)} 
        onOpen={() => setDetailDrawerOpen(true)}
      >
        <div style={{width: 500}}>
          Media Detail Drawer
        </div>
      </SwipeableDrawer>
      <SwipeableDrawer 
        anchor={"left"} 
        open={importDrawerOpen} 
        onClose={() => setImportDrawerOpen(false)} 
        onOpen={() => setImportDrawerOpen(true)}>
        <div style={{width: 500}}>
          Import Drawer
          {repo && (
            <RichObjectTreeView folders={repo.folders} onChange={getEntries} />
          )}
        </div>
      </SwipeableDrawer>
    </ExtensionContextProvider>
  );
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
      defaultExpanded={["root"]}
      defaultExpandIcon={<ChevronRightIcon />}
      style={{ flexGrow: 1 }}
      onNodeSelect={(event: React.SyntheticEvent, nodeId: string) => {
        if (props.onChange) {
          props.onChange(nodeId);
        }
      }}
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
  );
}

export default App;
