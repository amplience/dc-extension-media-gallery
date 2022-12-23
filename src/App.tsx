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
  GridViewOutlined,
  InfoOutlined,
  CheckBoxOutlined,
  CalendarMonthOutlined,
  PhotoCameraFrontOutlined,
  NotesOutlined,
  LockOutlined
} from "@mui/icons-material";
import {
  Alert,
  AlertColor,
  AppBar,
  Button,
  Dialog,
  Divider,
  ImageListItem,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Menu,
  MenuItem,
  Slide,
  Snackbar,
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
import { SlideProps } from '@mui/material/Slide';

const itemData = [
  { id: 1, selected: false, dateModified: "2022-12-21T20:15:20.379Z", img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d", title: "Burger", author: "@rollelflex_graphy726", },
  { id: 2, selected: false, dateModified: "2022-11-20T19:25:20.379Z", img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45", title: "Camera", author: "@helloimnik", },
  { id: 3, selected: false, dateModified: "2022-11-20T19:15:20.379Z", img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c", title: "Coffee", author: "@nolanissac", },
  { id: 4, selected: false, dateModified: "2022-12-30T18:25:20.379Z", img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8", title: "Hats", author: "@hjrc33", },
  { id: 5, selected: false, dateModified: "2022-11-20T19:35:20.379Z", img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62", title: "Honey", author: "@arwinneil", },
  { id: 6, selected: false, dateModified: "2022-12-30T17:25:20.379Z", img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6", title: "Basketball", author: "@tjdragotta", },
  { id: 7, selected: false, dateModified: "2022-11-20T19:45:20.379Z", img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f", title: "Fern", author: "@katie_wasserman", },
  { id: 8, selected: false, dateModified: "2022-12-30T16:25:20.379Z", img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25", title: "Mushrooms", author: "@silverdalex", },
  { id: 9, selected: false, dateModified: "2022-12-21T20:15:20.379Z", img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af", title: "Tomato basil", author: "@shelleypauls", },
  { id: 10, selected: false, dateModified: "2022-12-30T15:25:20.379Z", img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1", title: "Sea star", author: "@peterlaster", },
  { id: 11, selected: false, dateModified: "2022-12-30T14:25:20.379Z", img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6", title: "Bike", author: "@southside_customs", },
  { id: 12, selected: false, dateModified: "2022-12-21T20:15:20.379Z", img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e", title: "Breakfast", author: "@bkristastucchio", },
  { id: 13, selected: false, dateModified: "2021-12-30T13:25:20.379Z", img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3", title: "Concert crowd", author: "@silverdalex", },
  { id: 14, selected: false, dateModified: "2021-11-20T12:15:20.379Z", img: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec", title: "Crowd love", author: "@silverdalex", },
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

  const [items, setItems] = useState(structuredClone(itemData));
  const [initialItems, seInitialItems] = useState(structuredClone(itemData));
  const [importItems, setImportItems] = useState(structuredClone(itemData));
  const [gridMode, setGridMode] = useState(true);
  const [repo, setRepo] = useState<EnrichedRepository>();
  const [chApi, setChApi] = useState<ChApi>();
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [importDrawerOpen, setImportDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const sortOpen = Boolean(anchorEl);
  const [fullscreenView, setFullscreenView] = useState(false)
  const [currentMedia, setCurrentMedia] = useState(itemData[0])
  const [tempMedia, setTempMedia] = useState(itemData[0])
  const [snackOpen, setSnackOpen] = useState(false);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false)
  const [currentAlert, setCurrentAlert] = useState({
    message: "Sucess!",
    severity: "success"
  })

  /**
   * Opening alert
   */
  const handleSnackOpen = () => {
    setSnackOpen(true);
  };

  /**
   * Closing alert
   * @param event 
   * @param reason 
   * @returns 
   */
  const handleSnackClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackOpen(false);
  };

  /**
   * Opening sort menu
   * @param event 
   */
  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Opening fullscreen view
   * @param media 
   */
  const handleFullScreenView = (media: any) => {
    setCurrentMedia(media)
    setFullscreenView(true)
  }

  /**
   * Opening media details view
   * @param media 
   */
  const handleDetailView = (media: any) => {
    setCurrentMedia(media)
    setTempMedia(media)
    setDetailDrawerOpen(true)
  }

  /**
   * Closing sort menu
   */
  const handleSortClose = () => {
    setAnchorEl(null);
  };

  /**
   * 
   */
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

  /**
   * 
   * @param id 
   */
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

  /**
   * 
   */
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

  /**
   * 
   * @param event 
   */
  const dragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item: any) => item.id === active.id);
      const newIndex = items.findIndex((item: any) => item.id === over.id);

      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  /**
   * 
   * @param index 
   */
  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    setItems(newItems);
  };

  return (
    <ExtensionContextProvider>

      {/* Image full screen view */}
      <Dialog
        fullScreen
        open={fullscreenView}
        onClose={() => setFullscreenView(false)}
        PaperProps={{
          sx: { background: 'rgba(0, 0, 0, 0.2)' }
        }}
      >
        <Box sx={{ p: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <img
              src={`${currentMedia.img}??w=2048&h=1365&fit=crop&auto=format`}
              srcSet={`${currentMedia.img}??w=2048&h=1365&fit=crop&auto=format&dpr=2 2x`}
              alt={currentMedia.title}
              onClick={() => setFullscreenView(false)}
              loading="lazy"
              width={'100%'}
            />
            <IconButton
              aria-label={`close import drawer`}
              size="small"
              sx={{ color: 'white', position: 'absolute', top: 8, left: 8 }}
              onClick={() => setInfoPanelOpen(!infoPanelOpen) }
            >
              <InfoOutlined />
            </IconButton>

            {/* Info Panel */}
            {
              infoPanelOpen &&
              <Box
                sx={{ 
                  position: 'absolute', 
                  top: 50, 
                  p: 2, 
                  left: 16, 
                  minWidth: '450px', 
                  borderRadius: 1, 
                  background: 'rgba(255, 255, 255, 0.6)' 
                }} 
                >
                  <Typography variant="subtitle2">Media Details</Typography>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{p: '1px'}}><Typography variant="caption">Date modified</Typography></TableCell>
                        <TableCell sx={{p: '1px'}}><Typography variant="caption">{new Date(currentMedia.dateModified).toLocaleString()}</Typography></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{p: '1px'}}><Typography variant="caption">Author</Typography></TableCell>
                        <TableCell sx={{p: '1px'}}><Typography variant="caption">{currentMedia.author}</Typography></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{p: '1px'}}><Typography variant="caption">Caption</Typography></TableCell>
                        <TableCell sx={{p: '1px'}}><Typography variant="caption">{currentMedia.title}</Typography></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
              </Box>
            }
            <IconButton
              aria-label={`close fullscreen view`}
              size="small"
              sx={{ color: 'white', position: 'absolute', top: 8, right: 8 }}
              onClick={() => setFullscreenView(false)}
            >
              <CloseOutlined />
            </IconButton>
          </Box>
          <Box 
            sx={{height: '1000%'}}
            onClick={() => setFullscreenView(false)}
          />
        </Box>
      </Dialog>
      <Box style={{ width: '100%' }}>

        {/* Toolbar */}
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
              title="Import"
              onClick={() => {
                const newItems = structuredClone(importItems)
                newItems.map((element: any) => {
                  element.selected = false
                  return element
                })
                setImportItems(newItems)
                setImportDrawerOpen(true)
              }}
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
              title="Select all"
              onClick={() => {
                const newItems = structuredClone(items)
                newItems.map((element: any) => {
                  element.selected = true
                  return element
                })
                setItems(newItems)
              }}
            >
              <GridViewSharp />
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              size="small"
              aria-label={`select none`}
              title="Select none"
              onClick={() => {
                const newItems = structuredClone(items)
                newItems.map((element: any) => {
                  element.selected = false
                  return element
                })
                setItems(newItems)
              }}
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
              aria-label={`remove selected`}
              title="Remove selected"
              size="small"
              onClick={() => {
                const itemsToDelete = items.filter((item: any) => item.selected)
                const numChanges = itemsToDelete.length
                if (numChanges > 0) {
                  setItems((prev: any) => prev.filter((item: any) => !item.selected))
                  setCurrentAlert({
                    severity: "success",
                    message: `${numChanges} item${numChanges > 1 ? 's' : ''} removed successfully!`
                  })
                } else {
                  setCurrentAlert({
                    severity: "info",
                    message: `No item selected`
                  })
                }
                setTimeout(() => {handleSnackOpen()}, 500)
              }}
            > 
              <DeleteOutline />
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              aria-label={`sort`}
              title="Sort by"
              onClick={handleSortClick}
              size="small"
            >
              <SortOutlined />
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              aria-label={`reset`}
              size="small"
              title="Reset"
              onClick={() => {
                setItems(structuredClone(itemData))
                setCurrentAlert({
                  severity: "success",
                  message: "Collection reset successfully!"
                })
                setTimeout(() => {handleSnackOpen()}, 500)
              }}
            >
              <CachedOutlined />
            </IconButton>

            {/* Sort menu */}
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={sortOpen}
              onClose={handleSortClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <ListSubheader>Sort By</ListSubheader>
              <MenuItem onClick={() => {
                setItems(structuredClone(items).sort((a: any, b: any) => (new Date(a.dateModified).getTime() - new Date(b.dateModified).getTime())))
                handleSortClose()
              }}>
                <ListItemIcon><ArrowUpwardOutlined fontSize="small" /></ListItemIcon>
                <ListItemText>Date Modified Asc</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                setItems(structuredClone(items).sort((a: any, b: any) => (new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime())))
                handleSortClose()
              }}>
                <ListItemIcon><ArrowDownwardOutlined fontSize="small" /></ListItemIcon>
                <ListItemText>Date Modified Desc</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                setItems(structuredClone(items).sort((a: any, b: any) => (a.author > b.author) ? 1 : ((b.author > a.author) ? -1 : 0)))
                handleSortClose()
              }}>
                <ListItemIcon><ArrowUpwardOutlined fontSize="small" /></ListItemIcon>
                <ListItemText>Author Asc</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                setItems(structuredClone(items).sort((a: any, b: any) => (b.author > a.author) ? 1 : ((a.author > b.author) ? -1 : 0)))
                handleSortClose()
              }}>
                <ListItemIcon><ArrowDownwardOutlined fontSize="small" /></ListItemIcon>
                <ListItemText>Author Desc</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                setItems(structuredClone(items).sort((a: any, b: any) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0)))
                handleSortClose()
              }}>
                <ListItemIcon><ArrowUpwardOutlined fontSize="small" /></ListItemIcon>
                <ListItemText>Caption Asc</ListItemText>
              </MenuItem>
              <MenuItem onClick={() => {
                setItems(structuredClone(items).sort((a: any, b: any) => (b.title > a.title) ? 1 : ((a.title > b.title) ? -1 : 0)))
                handleSortClose()
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
                title="List view"
                onClick={() => setGridMode(false)}
              >
                <ViewHeadlineOutlined />
              </IconButton>
            }
            {!gridMode &&
              <IconButton
                sx={{ color: "white" }}
                aria-label={`grid mode`}
                title="Grid view"
                onClick={() => setGridMode(true)}
              >
                <AppsOutlined />
              </IconButton>
            }
          </Toolbar>
        </AppBar>

        {/* Main view */}
        <Box sx={{ w: '100%', pr: 2, pl: 2 }}>
          {gridMode ? (

            // Grid view
            <ImageList cols={cols} gap={8}>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={dragEnd}
                modifiers={[restrictToWindowEdges, restrictToParentElement]}
              >
                <SortableContext items={items} strategy={rectSortingStrategy}>
                  {items.map((item: any, index: number) => (
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
                        title="Click to zoom"
                        onClick={() => handleFullScreenView(item)}
                      />
                      <IconButton
                        sx={{
                          color: "white",
                          position: "absolute",
                          top: 0,
                          left: 0,
                        }}
                        aria-label={`edit`}
                        title="Edit"
                        onClick={() => handleDetailView(item)}
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
                        title="Remove"
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
                            title="Select"
                            onClick={() => {
                              const newItems = items.slice()
                              const itemToUpdate = newItems.find((element: any) => element.id === item.id)
                              if (itemToUpdate) {
                                itemToUpdate.selected = !itemToUpdate.selected
                                setItems(newItems)
                              }
                            }}
                          >
                            {
                              item.selected ?  <CheckBoxOutlined /> : <CheckBoxOutlineBlank />
                            }
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
            // List view
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
                      <TableCell component="th" />
                      <TableCell sx={{ color: "white", fontWeight: "bold" }} component="th">Media</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }} component="th" align="left">Actions</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }} component="th" align="left">Title</TableCell>
                      <TableCell sx={{ color: "white", fontWeight: "bold" }} component="th" align="left">Author</TableCell>
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
                            title="Select"
                            onClick={() => {
                              const newItems = items.slice()
                              const itemToUpdate = newItems.find((element: any) => element.id === item.id)
                              if (itemToUpdate) {
                                itemToUpdate.selected = !itemToUpdate.selected
                                setItems(newItems)
                              }
                            }}
                          >
                            {
                              item.selected ?  <CheckBoxOutlined /> : <CheckBoxOutlineBlank />
                            }
                          </IconButton>
                        </TableCell>
                        <TableCell>
                          <img
                            src={`${item.img}?w=124&h=82&fit=crop&auto=format`}
                            srcSet={`${item.img}?w=124&h=82&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.title}
                            title="Click to zoom"
                            onClick={() => handleFullScreenView(item)}
                            loading="lazy"
                          />
                        </TableCell>
                        <TableCell align="left">
                          <IconButton
                            sx={{ color: "white" }}
                            aria-label={`edit`}
                            title="Edit"
                            onClick={() => handleDetailView(item)}
                          >
                            <EditOutlined />
                          </IconButton>
                          <IconButton
                            sx={{ color: "white" }}
                            aria-label={`delete`}
                            title="Remove"
                            onClick={() => removeItem(index)}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </TableCell>
                        <TableCell sx={{ color: "white" }} align="left">{item.title}</TableCell>
                        <TableCell sx={{ color: "white" }} align="left">{item.author}</TableCell>
                      </SortableTableRow>
                    ))}
                  </TableBody>
                </Table>
              </SortableContext>
            </DndContext>
          )}
        </Box>

        {/* Image detail drawer */}
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
              src={`${currentMedia.img}?w=2048&h=1365&fit=crop&auto=format`}
              srcSet={`${currentMedia.img}?w=2048&h=1365&fit=crop&auto=format&dpr=2 2x`}
              alt={currentMedia.title}
              title="Click to zoom"
              onClick={() => { handleFullScreenView(currentMedia) }}
              loading="lazy"
            />
            <TextField
              id="dateModified"
              label="Date modified"
              variant="standard"
              InputProps={{ 
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarMonthOutlined />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined />
                  </InputAdornment>
                )
              }}
              defaultValue={new Date(currentMedia.dateModified).toLocaleString()}
            />
            <TextField
              id="author"
              label="Author"
              variant="standard"
              defaultValue={currentMedia.author}
              InputProps={{ 
                startAdornment: (
                  <InputAdornment position="start">
                    <PhotoCameraFrontOutlined />
                  </InputAdornment>
                )
              }}
              onChange={(event) => {
                tempMedia.author = event.target.value
              }}
            />
            <TextField
              multiline
              rows={4}
              id="caption"
              label="Caption"
              variant="standard"
              defaultValue={currentMedia.title}
              InputProps={{ 
                startAdornment: (
                  <InputAdornment style={{ display: 'flex', flexDirection: 'column-reverse'}} position="start" >
                    <NotesOutlined />
                  </InputAdornment>
                )
              }}
              onChange={(event) => {
                tempMedia.title = event.target.value
              }}
            />
            <Stack sx={{ pb: 4 }} direction={"row"}>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                sx={{ mr: 2 }}
                variant="contained"
                onClick={() => {
                  setDetailDrawerOpen(false)
                  setCurrentMedia(tempMedia)
                  setCurrentAlert({
                    severity: "success",
                    message: "Media details successfully saved!"
                  })
                  setTimeout(() => {handleSnackOpen()}, 500)
                }}
              >Save</Button>
              <Button
                variant="outlined"
                onClick={() => setDetailDrawerOpen(false)}
              >Cancel</Button>
            </Stack>
          </Stack>
        </SwipeableDrawer>

        {/* Import media drawer */}
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
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton
                    size="small"
                    aria-label={`select all`}
                    title="Select all"
                    onClick={() => {
                      const newItems = importItems.slice()
                      newItems.map((element: any) => {
                        element.selected = true
                        return element
                      })
                      setImportItems(newItems)
                    }}
                  >
                    <GridViewSharp />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label={`select none`}
                    title="Select none"
                    onClick={() => {
                      const newItems = importItems.slice()
                      newItems.map((element: any) => {
                        element.selected = false
                        return element
                      })
                      setImportItems(newItems)
                    }}
                  >
                    <GridViewOutlined />
                  </IconButton>
                </Stack>
                <ImageList cols={5} rowHeight={200}>
                  {importItems.map((item: any) => (
                    <ImageListItem
                      key={item.img}
                    >
                      <img
                        src={`${item.img}?w=150&h=100&fit=crop&auto=format`}
                        srcSet={`${item.img}?w=150&h=100&fit=crop&auto=format&dpr=2 2x`}
                        alt={item.title}
                        onClick={() => handleFullScreenView(item)}
                        title="Click to zoom"
                        loading="lazy"
                      />
                      <ImageListItemBar
                        title={item.title}
                        subtitle={<span>by: {item.author}</span>}
                        position="below"
                        actionIcon={
                          <IconButton
                            aria-label={`select ${item.title}`}
                            title="Select"
                            onClick={() => {
                              const newImportItems = importItems.slice()
                              const itemToUpdate = newImportItems.find((element: any) => element.id === item.id)
                              if (itemToUpdate) {
                                itemToUpdate.selected = !itemToUpdate.selected
                                setImportItems(newImportItems)
                              }
                            }}
                          >
                            {
                              item.selected ?  <CheckBoxOutlined /> : <CheckBoxOutlineBlank />
                            }
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
                onClick={() => {
                  setImportDrawerOpen(false)
                  if (importItems.filter((item: any) => item.selected).length === 0) {
                    setCurrentAlert({
                      severity: "info",
                      message: "No media file selected for import"
                    })
                    setTimeout(() => {handleSnackOpen()}, 500)
                  } else {
                    const newItems = structuredClone(items)
                    const newSelectedItems = importItems.filter((item: any) => {
                      return item.selected && items.filter((item2: any) => item2.id === item.id).length === 0
                    }).map((item: any) =>  { 
                      item.selected = false 
                      return item
                    })
                    setTimeout(() => {setItems(newItems.concat(structuredClone(newSelectedItems)))}, 500)
                    if (newSelectedItems.length > 0) {
                      setCurrentAlert({
                        severity: "success",
                        message: `${newSelectedItems.length} new media file${newSelectedItems.length > 1 ? 's' : ''} successful imported!`
                      })
                    } else {
                      setCurrentAlert({
                        severity: "info",
                        message: `No new media file was imported`
                      })
                    }
                    setTimeout(() => {handleSnackOpen()}, 1000)
                  }
                }}
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

      {/* Snack Bar for alerts */}
      <Snackbar 
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
        open={snackOpen} 
        autoHideDuration={3000} 
        onClose={handleSnackClose} 
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleSnackClose} severity={currentAlert.severity as AlertColor} sx={{ width: '100%' }}>
          {currentAlert.message}
        </Alert>
      </Snackbar>
    </ExtensionContextProvider>
  );
}

/**
 * Slide transition for alerts
 * @param props 
 * @returns 
 */
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

/**
 * Folders tree view
 * @param props 
 * @returns 
 */
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