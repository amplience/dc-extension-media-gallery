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
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  ExpandMore,
  ChevronRight,
  CollectionsOutlined,
  CloseOutlined,
  GridViewSharp,
  GridViewOutlined
} from "@mui/icons-material";
import {
  AppBar,
  Button,
  Divider,
  ImageListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
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
import TreeItem from "@mui/lab/TreeItem";

import { useEffect, useState } from "react";
import { ExtensionContextProvider } from "./extension-context";
import { ChApi, Folder, EnrichedRepository } from "./ch-api";
import credentials from "./credentials";
import { convertToEntry, defaultExifMap } from "./model/conversion";
import { Box } from "@mui/material";
import { Stack } from "@mui/system";

const itemData = [
  { id: 1, img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d", title: "Burger", author: "@rollelflex_graphy726", },
  { id: 2, img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45", title: "Camera", author: "@helloimnik", },
  { id: 3, img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c", title: "Coffee", author: "@nolanissac", },
  { id: 4, img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8", title: "Hats", author: "@hjrc33", },
  { id: 5, img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62", title: "Honey", author: "@arwinneil", },
  { id: 6, img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6", title: "Basketball", author: "@tjdragotta", },
  { id: 7, img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f", title: "Fern", author: "@katie_wasserman", },
  { id: 8, img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25", title: "Mushrooms", author: "@silverdalex", },
  { id: 9, img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af", title: "Tomato basil", author: "@shelleypauls", },
  { id: 10, img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Sea star", author: "@peterlaster", },
  { id: 11, img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6", title: "Bike", author: "@southside_customs", },
  { id: 12, img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e", title: "Breakfast", author: "@bkristastucchio", },
  { id: 13, img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3", title: "Concert crowd", author: "@silverdalex", },
  { id: 14, img: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec", title: "Crowd love", author: "@silverdalex", },
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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const sortOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      <Box style={{ width: '100%' }}>
        <AppBar position="sticky">
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <CollectionsOutlined />
            </IconButton>
            <Typography variant="h6" color="inherit" component="div">
              Image Gallery
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              sx={{ color: "white" }}
              aria-label={`import`}
              size="small"
              onClick={() => setImportDrawerOpen(true)}
            >
              <AddPhotoAlternateOutlined />
            </IconButton>
            <Divider
              orientation="vertical"
              variant="middle"
              sx={{ ml: 1, mr: 1 }}
              flexItem />
            <IconButton
              sx={{ color: "white" }}
              size="small"
              aria-label={`select all`}
            >
              <GridViewSharp />
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              size="small"
              aria-label={`select none`}
            >
              <GridViewOutlined />
            </IconButton>
            <Divider
              orientation="vertical"
              variant="middle"
              sx={{ ml: 1, mr: 1 }}
              flexItem />
            <IconButton
              sx={{ color: "white" }}
              aria-label={`delete selected`}
              size="small"
            >
              <DeleteOutline />
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              aria-label={`sort`}
              onClick={handleClick}
              size="small"
            >
              <SortOutlined />
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              aria-label={`reset`}
              size="small"
              onClick={() => setItems(itemData)}
            >
              <CachedOutlined />
            </IconButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={sortOpen}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <ListSubheader>Sort By</ListSubheader>
              <MenuItem onClick={handleClose}>
                <ListItemIcon><ArrowUpwardOutlined fontSize="small" /></ListItemIcon>
                <ListItemText>Date Modified Asc</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClose}>
                <ListItemIcon><ArrowDownwardOutlined fontSize="small" /></ListItemIcon>
                <ListItemText>Date Modified Desc</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                setItems(items.slice().sort((a, b) => (a.author > b.author) ? 1 : ((b.author > a.author) ? -1 : 0)))
                handleClose()
              }}>
                <ListItemIcon><ArrowUpwardOutlined fontSize="small" /></ListItemIcon>
                <ListItemText>Author Asc</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                setItems(items.slice().sort((a, b) => (b.author > a.author) ? 1 : ((a.author > b.author) ? -1 : 0)))
                handleClose()
              }}>
                <ListItemIcon><ArrowDownwardOutlined fontSize="small" /></ListItemIcon>
                <ListItemText>Author Desc</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                setItems(items.slice().sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)))
                handleClose()
              }}>
                <ListItemIcon><ArrowUpwardOutlined fontSize="small" /></ListItemIcon>
                <ListItemText>Caption Asc</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                setItems(items.slice().sort((a, b) => (b.title > a.title) ? 1 : ((a.title > b.title) ? -1 : 0)))
                handleClose()
              }}>
                <ListItemIcon><ArrowDownwardOutlined fontSize="small" /></ListItemIcon>
                <ListItemText>Caption Desc</ListItemText>
              </MenuItem>
            </Menu>
            <Divider
              orientation="vertical"
              variant="middle"
              sx={{ ml: 1, mr: 1 }}
              flexItem />
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
          </Toolbar>
        </AppBar>
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
                      onClick={() => setDetailDrawerOpen(true)}
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
                      subtitle={<span>by: {item.author} {item.id}</span>}
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
                          onClick={() => setDetailDrawerOpen(true)}
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
          PaperProps={{
            sx: { width: "50%", p: 2 },
          }}
          anchor={'left'}
          open={detailDrawerOpen}
          onClose={() => setDetailDrawerOpen(false)}
          onOpen={() => setDetailDrawerOpen(true)}
          variant="temporary"
          ModalProps={{
            keepMounted: false,
          }}
        >
          <Stack spacing={2} sx={{ h: '100%' }}>
            <Stack direction={"row"}>
              <Typography sx={{ pb: 2 }} variant="h5" component="h5">Media Details</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Box>
                <IconButton
                  aria-label={`close detail drawer`}
                  size="small"
                  onClick={() => setDetailDrawerOpen(false)}
                >
                  <CloseOutlined />
                </IconButton>
              </Box>
            </Stack>
            <img
              src={`${itemData[0].img}?auto=format`}
              srcSet={`${itemData[0].img}?auto=format&dpr=2 2x`}
              alt={itemData[0].title}
              loading="lazy"
            />
            <TextField id="dateModified" label="Date modified" variant="standard" InputProps={{ readOnly: true }} />
            <TextField id="author" label="Author" variant="standard" />
            <TextField multiline rows={4} id="caption" label="Caption" variant="standard" />
            <Stack sx={{ pb: 4 }} direction={"row"}>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                sx={{ mr: 2 }}
                variant="contained"
                onClick={() => setDetailDrawerOpen(false)}
              >Save</Button>
              <Button
                variant="outlined"
                onClick={() => setDetailDrawerOpen(false)}
              >Cancel</Button>
            </Stack>
          </Stack>
        </SwipeableDrawer>
        <SwipeableDrawer
          PaperProps={{
            sx: { width: "90%", p: 2 },
          }}
          anchor={'left'}
          open={importDrawerOpen}
          onClose={() => setImportDrawerOpen(false)}
          onOpen={() => setImportDrawerOpen(true)}>
          <Stack spacing={2} sx={{ h: '100%' }}>
            <Stack direction={"row"}>
              <Typography sx={{ pb: 2 }} variant="h5" component="h5">Import Media</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <Box>
                <IconButton
                  aria-label={`close import drawer`}
                  size="small"
                  onClick={() => setImportDrawerOpen(false)}
                >
                  <CloseOutlined />
                </IconButton>
              </Box>
            </Stack>
            <Stack direction={"row"} spacing={4}>
              {repo && (
                <RichObjectTreeView folders={repo.folders} onChange={getEntries} />
              )}
              <Divider
                orientation="vertical"
              />
              <Stack sx={{ w: '100%' }}>
                <Stack sx={{ pb: 4 }} direction={"row"}>
                  <Button
                    sx={{ mr: 2 }}
                    variant="outlined"
                    startIcon={<GridViewSharp />}
                  >Select all</Button>
                  <Button
                    sx={{ mr: 2 }}
                    variant="outlined"
                    startIcon={<GridViewOutlined />}
                  >Select none</Button>
                </Stack>
                <ImageList cols={5} rowHeight={200}>
                  {itemData.map((item) => (
                    <ImageListItem key={item.img}>
                      <img
                        src={`${item.img}?w=150&h=100&fit=crop&auto=format`}
                        srcSet={`${item.img}?w=150&h=100&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.title}
                        loading="lazy"
                      />
                      <ImageListItemBar
                        title={item.title}
                        subtitle={<span>by: {item.author} {item.id}</span>}
                        position="below"
                        actionIcon={
                          <IconButton
                            aria-label={`select ${item.title}`}
                          >
                            <CheckBoxOutlineBlank />
                          </IconButton>
                        }
                        actionPosition="left"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Stack>
            </Stack>
            <Stack sx={{ pb: 4 }} direction={"row"}>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                sx={{ mr: 2 }}
                variant="contained"
                onClick={() => setImportDrawerOpen(false)}
              >Import</Button>
              <Button
                variant="outlined"
                onClick={() => setImportDrawerOpen(false)}
              >Cancel</Button>
            </Stack>
          </Stack>
        </SwipeableDrawer>
      </Box>
      <Box sx={{ flexGrow: 1 }} />
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
      defaultCollapseIcon={<ExpandMore />}
      defaultExpanded={["root"]}
      defaultExpandIcon={<ChevronRight />}
      style={{ flexGrow: 1, maxWidth: '400px' }}
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