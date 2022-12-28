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
  LockOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Alert,
  AlertColor,
  AppBar,
  Badge,
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

/**
 * Media item
 */
interface MediaItem {
  id: number;
  selected: boolean;
  dateModified: string;
  img: string;
  title: string;
  author: string;
}

/**
 * Alert message
 */
interface AlertMessage {
  severity: AlertColor
  message: string
}

// TODO: get assets from Content Hub
const itemData: MediaItem[] = [
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

function MediaGalleryApp() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isLarge = useMediaQuery(theme.breakpoints.down("lg"));
  const isXLarge = useMediaQuery(theme.breakpoints.down("xl"));

  const [cols, setCols] = useState(5);
  const [items, setItems] = useState<MediaItem[]>(structuredClone(itemData));
  const [importItems, setImportItems] = useState<MediaItem[]>(structuredClone(itemData));
  const [gridMode, setGridMode] = useState(true);
  const [repo, setRepo] = useState<EnrichedRepository>();
  const [chApi, setChApi] = useState<ChApi>();
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false)
  const [importDrawerOpen, setImportDrawerOpen] = useState(false)
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null)
  const sortOpen = Boolean(sortAnchorEl);
  const [dragging, setDragging] = useState(false)
  const [fullscreenView, setFullscreenView] = useState(false)
  const [contextMedia, setContextMedia] = useState<MediaItem | null>(null)
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null)
  const [tempMedia, setTempMedia] = useState<MediaItem | null>(null)
  const [snackOpen, setSnackOpen] = useState(false);
  const [infoPanelOpen, setInfoPanelOpen] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<AlertMessage | null>(null)
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);

  /**
   * re-calculate cols
   */
  useEffect(() => {
    function handleResize() {
      if (isXLarge) setCols(5)
      if (isLarge) setCols(4)
      if (isTablet) setCols(3)
      if (isMobile) setCols(2)
    }
    window.addEventListener('resize', handleResize)
  })

  /**
   * Open context menu
   * @param event 
   */
  const handleContextMenu = (event: React.MouseEvent) => {
    setContextMedia(null)
    event.preventDefault();
    if (event.target instanceof HTMLElement) {
      if (event.target.id) {
        const filteredItems = items.filter((element: MediaItem) => (parseInt((event.target as HTMLElement).id) === element.id))
        console.log(filteredItems)
        if (filteredItems.length > 0) {
          setContextMedia(filteredItems[0])
        }
      }
    }
    setContextMenu(
      contextMenu === null
        ? {
          mouseX: event.clientX + 2,
          mouseY: event.clientY - 6,
        }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
        // Other native context menus might behave different.
        // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
        null,
    );
  };

  /**
   * Close context menu
   */
  const handleContextClose = () => {
    setContextMenu(null);
  };

  /**
   * Opening alert
   * TODO: move to components
   */
  const handleSnackOpen = () => {
    setSnackOpen(true);
  };

  /**
   * Closing alert
   * TODO: move to components
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
   * TODO: move to components
   * @param event 
   */
  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  /**
   * Opening fullscreen view
   * TODO: move to components
   * @param media 
   */
  const handleFullScreenView = (media: MediaItem) => {
    setCurrentMedia(media)
    setFullscreenView(true)
  }

  /**
   * Opening media details view
   * TODO: move to components
   * @param media 
   */
  const handleDetailView = (media: MediaItem) => {
    setCurrentMedia(media)
    setTempMedia(structuredClone(media))
    setDetailDrawerOpen(true)
  }

  /**
   * Closing sort menu
   * TODO: move to components
   */
  const handleSortClose = () => {
    setSortAnchorEl(null);
  };

  /**
   * Drag-and-drop sensors setup
   * Using distance to enable icon buttons on images
   * Using "Enter" key only to start and end drag-end-drop
   * for the same reason
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      keyboardCodes: {
        start: ['Enter'],
        cancel: ['Escape'],
        end: ['Enter']
      },
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Getting assets from Content Hub
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
   * Move focus from current active element
   * @param offset 
   */
  const offsetActiveElementIndex = (offset: number) => {
    const element: Element | null = document.activeElement
    if (element) {
      const parent: HTMLElement | null = element.parentElement
      if (parent) {
        const children: HTMLCollection = parent.children
        if (children) {
          let found = -1
          for (let i = 0; i < children.length; i++) {
            if (children[i] === element) {
              found = i
            }
            if ((found + offset < children.length ) &&
              (found + offset >= 0)) {
              (children.item(found + offset) as HTMLElement).focus()
            }
          }
        }
      }
    }
  }

  /**
   * Keyboard shortcuts
   */
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      const nonModalMode = !fullscreenView && !importDrawerOpen && !detailDrawerOpen && !sortOpen && !dragging && !contextMenu
      if (nonModalMode) {
        if (event.key.toLowerCase() === 'i') {
          handleImport()
        } else if (event.key.toLowerCase() === 'a') {
          handleSelectAll()
        } else if (event.key.toLowerCase() === 'n') {
          handleSelectNone()
        } else if (event.key === 'Z') {
          handleResetItems()
        } else if (event.key === 'R') {
          handleRemoveSelected()
        } else if (event.key.toLowerCase() === 'g') {
          setGridMode(true)
        } else if (event.key.toLowerCase() === 'l') {
          setGridMode(false)
        } else if (event.key.toLowerCase() === 'v') {
          const element = document.activeElement as HTMLElement
          const id = parseInt(element.id)
          const item = getItem(id)
          if (item) {
            handleFullScreenView(item) 
          }
        } else if (event.key.toLowerCase() === 'e') {
          const element = document.activeElement as HTMLElement
          const id = parseInt(element.id)
          const item = getItem(id)
          if (item) {
            handleDetailView(item)
          }
        } else if (event.key === 'r') {
          const element = document.activeElement as HTMLElement
          const id = parseInt(element.id)
          if (id) {
            removeItem(id)
          }
        } else if (event.key.toLowerCase() === 'm') {
          const element = document.activeElement as HTMLElement
          const id = element.id
          setContextMedia(items.find((item) => item.id === parseInt(id)) || null)
          setContextMenu({mouseX: element.getBoundingClientRect().x+50, mouseY: element.getBoundingClientRect().y+50})
        } else if (event.key.toLowerCase() === 's') {
          setSortAnchorEl(document.getElementById('toolbar-icon-sort'))
        } else if (event.key === 'ArrowRight') {
          offsetActiveElementIndex(1)
        } else if (event.key === 'ArrowLeft') {
          offsetActiveElementIndex(-1)
        } else if (event.key === 'ArrowDown' && gridMode) {
          offsetActiveElementIndex(cols)
        } else if (event.key === 'ArrowUp' && gridMode) {
          offsetActiveElementIndex(-cols)
        } else if (event.key === 'ArrowDown' && !gridMode) {
          offsetActiveElementIndex(1) 
        } else if (event.key === 'ArrowUp' && !gridMode) {
          offsetActiveElementIndex(-1)
        }
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [items, dragging, cols, gridMode, fullscreenView, importDrawerOpen, detailDrawerOpen, sortOpen, contextMenu]);

  /** 
   * Getting folders from Content Hub
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
    * Drag-end-Drop action start
    * @param event 
    */
  const dragStart = (event: any) => {
    setDragging(true)
  }

  /**
   * Drag-end-Drop action end
   * @param event 
   */
  const dragEnd = (event: any) => {
    setDragging(false)
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item: MediaItem) => item.id === active.id)
      const newIndex = items.findIndex((item: MediaItem) => item.id === over.id)
      setItems(arrayMove(items, oldIndex, newIndex))
    }
  };

  /**
   * Get an item from the collection
   * @param id 
   */
    const getItem = (id: number) => {
      return items.find((item: MediaItem) => id === item.id)
    }

  /**
   * Remove an item from the collection
   * @param id 
   */
  const removeItem = (id: number) => {
    setItems((prevState: MediaItem[]) => {
      return prevState.filter((item: MediaItem) => id !== item.id)
    })
  }

  /**
   * Select an item in the collection
   * @param id 
   */
  const selectItem = (id: number) => {
    setItems((prevState: MediaItem[]) => {
      return prevState.map((item: MediaItem) => {
        if (item.id === id) item.selected = !item.selected
        return item
      })
    })
  }

    /**
   * Select an item in the import collection
   * @param id 
   */
    const selectImportItem = (id: number) => {
      setImportItems((prevState: MediaItem[]) => {
        return prevState.map((item: MediaItem) => {
          if (item.id === id) item.selected = !item.selected
          return item
        })
      })
    }

  /**
   * Select all items
   */
  const handleSelectAll = () => {
    setItems((prevState: MediaItem[]) => {
      return prevState.map((element: MediaItem) => {
        element.selected = true
        return element
      })
    })
  }

  /**
   * Un-select all items
   */
  const handleSelectNone = () => {
    setItems((prevState: MediaItem[]) => {
      return prevState.map((element: MediaItem) => {
        element.selected = false
        return element
      })
    })
  }

  /**
   * Remove selected items
   */
  const handleRemoveSelected = () => {
    const itemsToDelete = items.filter((item: MediaItem) => item.selected)
    const numChanges = itemsToDelete.length
    if (numChanges > 0) {
      setItems((prev: MediaItem[]) => prev.filter((item: MediaItem) => !item.selected))
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
    setTimeout(() => { handleSnackOpen() }, 500)
  }

  /**
   * Reset collection
   */
  const handleResetItems = () => {
    setItems(structuredClone(itemData))
    setCurrentAlert({
      severity: "success",
      message: "Collection reset successfully!"
    })
    setTimeout(() => { handleSnackOpen() }, 500)
  }

  /**
   * Prepare and open import drawer
   */
  const handleImport = () => {
    const newItems = structuredClone(importItems)
    newItems.map((element: MediaItem) => {
      element.selected = false
      return element
    })
    setImportItems(newItems)
    setImportDrawerOpen(true)
  }

  /**
   * Import new media in collection
   */
  const importMedia = () => {
    setImportDrawerOpen(false)
    if (importItems.filter((item: MediaItem) => item.selected).length === 0) {
      setCurrentAlert({
        severity: "info",
        message: "No media file selected for import"
      })
      setTimeout(() => { handleSnackOpen() }, 500)
    } else {
      const newItems = structuredClone(items)
      const newSelectedItems = importItems.filter((item: MediaItem) => {
        return item.selected && items.filter((item2: MediaItem) => item2.id === item.id).length === 0
      }).map((item: MediaItem) => {
        item.selected = false
        return item
      })
      setTimeout(() => { setItems(newItems.concat(structuredClone(newSelectedItems))) }, 500)
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
      setTimeout(() => { handleSnackOpen() }, 1000)
    }
  }

  /**
   * Save item
   */
  const saveItem = () => {
    // TODO: move to function
    setDetailDrawerOpen(false)
    tempMedia && setItems((prevState: MediaItem[]) => {
      return prevState.map((item: MediaItem) => {
        if (item.id === tempMedia.id) item = tempMedia
        return item
      })
    })
    setCurrentAlert({
      severity: "success",
      message: "Media details successfully saved!"
    })
    setTimeout(() => { handleSnackOpen() }, 500)
  }

  return (
    <ExtensionContextProvider>

      {/* Image full screen view */}
      {/* TODO: move to components */}
      {/* TODO: mode styles for all components */}
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
              src={`${currentMedia?.img}??w=2048&h=1365&auto=format`}
              srcSet={`${currentMedia?.img}??w=2048&h=1365&auto=format&dpr=2 2x`}
              alt={currentMedia?.title}
              onClick={() => setFullscreenView(false)}
              loading="lazy"
              width={'100%'}
            />
            <IconButton
              aria-label={`close import drawer`}
              size="small"
              sx={{ color: 'white', position: 'absolute', top: 8, left: 8 }}
              onClick={() => setInfoPanelOpen(!infoPanelOpen)}
            >
              <InfoOutlined />
            </IconButton>

            {/* Info Panel */}
            {/* TODO: move to components */}
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
                  background: 'rgba(255, 255, 255, 0.4)'
                }}
              >
                <Typography variant="subtitle1">Media Details</Typography>
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ p: 0, borderBottom: "none" }}><Typography variant="caption">Date modified</Typography></TableCell>
                      <TableCell sx={{ p: 0, borderBottom: "none" }}><Typography variant="caption">{currentMedia?.dateModified && new Date(currentMedia.dateModified).toLocaleString()}</Typography></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ p: 0, borderBottom: "none" }}><Typography variant="caption">Author</Typography></TableCell>
                      <TableCell sx={{ p: 0, borderBottom: "none" }}><Typography variant="caption">{currentMedia?.author}</Typography></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ p: 0, borderBottom: "none" }}><Typography variant="caption">Caption</Typography></TableCell>
                      <TableCell sx={{ p: 0, borderBottom: "none" }}><Typography variant="caption">{currentMedia?.title}</Typography></TableCell>
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
            sx={{ height: '1000%' }}
            onClick={() => setFullscreenView(false)}
          />
        </Box>
      </Dialog>
      <Box style={{ width: '100%' }}>

        {/* Toolbar */}
        {/* TODO: move to components */}
        <AppBar position="sticky">
          <Toolbar variant="dense">
            <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={(event) => handleContextMenu(event)}>
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
              onClick={handleImport}
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
              onClick={handleSelectAll}
            >
              <GridViewSharp />
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              size="small"
              aria-label={`select none`}
              title="Select none"
              onClick={handleSelectNone}
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
              onClick={handleRemoveSelected}
            >
              <Badge badgeContent={items.filter((item: MediaItem) => item.selected).length} color="secondary">
                <DeleteOutline />
              </Badge>
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              aria-label={`sort`}
              title="Sort by"
              onClick={handleSortClick}
              size="small"
              id="toolbar-icon-sort"
            >
              <SortOutlined />
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              aria-label={`reset`}
              size="small"
              title="Reset"
              onClick={handleResetItems}
            >
              <CachedOutlined />
            </IconButton>

            {/* Sort menu */}
            {/* TODO: move to components */}
            <Menu
              id="basic-menu"
              anchorEl={sortAnchorEl}
              open={sortOpen}
              onClose={handleSortClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
              PaperProps={{
                style: {
                  width: '270px'
                }
              }}
            >
                <ListSubheader>Sort By</ListSubheader>
                <MenuItem dense autoFocus onClick={() => {
                  // TODO: move to function
                  setItems((prevState: MediaItem[]) => {
                    return prevState.sort((a: any, b: any) => (new Date(a.dateModified).getTime() - new Date(b.dateModified).getTime()))
                  })
                  handleSortClose()
                }}>
                  <ListItemIcon><ArrowUpwardOutlined fontSize="small" /></ListItemIcon>
                  <ListItemText>Date Modified Asc</ListItemText>
                </MenuItem>
                <MenuItem dense onClick={() => {
                  // TODO: move to function
                  setItems((prevState: MediaItem[]) => {
                    return prevState.sort((a: any, b: any) => (new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()))
                  })
                  handleSortClose()
                }}>
                  <ListItemIcon><ArrowDownwardOutlined fontSize="small" /></ListItemIcon>
                  <ListItemText>Date Modified Desc</ListItemText>
                </MenuItem>
                <MenuItem dense onClick={() => {
                  // TODO: move to function
                  setItems((prevState: MediaItem[]) => {
                    return prevState.sort((a: any, b: any) => (a.author > b.author) ? 1 : ((b.author > a.author) ? -1 : 0))
                  })
                  handleSortClose()
                }}>
                  <ListItemIcon><ArrowUpwardOutlined fontSize="small" /></ListItemIcon>
                  <ListItemText>Author Asc</ListItemText>
                </MenuItem>
                <MenuItem dense onClick={() => {
                  // TODO: move to function
                  setItems((prevState: MediaItem[]) => {
                    return prevState.sort((a: any, b: any) => (b.author > a.author) ? 1 : ((a.author > b.author) ? -1 : 0))
                  })
                  handleSortClose()
                }}>
                  <ListItemIcon><ArrowDownwardOutlined fontSize="small" /></ListItemIcon>
                  <ListItemText>Author Desc</ListItemText>
                </MenuItem>
                <MenuItem dense onClick={() => {
                  // TODO: move to function
                  setItems((prevState: MediaItem[]) => {
                    return prevState.sort((a: any, b: any) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
                  })
                  handleSortClose()
                }}>
                  <ListItemIcon><ArrowUpwardOutlined fontSize="small" /></ListItemIcon>
                  <ListItemText>Caption Asc</ListItemText>
                </MenuItem>
                <MenuItem dense onClick={() => {
                  // TODO: move to function
                  setItems((prevState: MediaItem[]) => {
                    return prevState.sort((a: any, b: any) => (b.title > a.title) ? 1 : ((a.title > b.title) ? -1 : 0))
                  })
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

        {/* Context Menu */}
        <Menu
          open={contextMenu !== null}
          onClose={handleContextClose}
          anchorReference="anchorPosition"
          anchorPosition={
            contextMenu !== null
              ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
              : undefined
          }
          PaperProps={{
            style: {
              width: '300px'
            }
          }}
        >
            {
              contextMedia != null &&
              <>
                <ListSubheader style={{ width: '250px', height: '50px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {contextMedia.title}
                </ListSubheader>
                {/* BUG: not working */}
                {/* 
                <MenuItem dense onClick={() => {
                  handleContextClose()
                  alert(contextMedia.id)
                  selectItem(contextMedia.id)
                }}> 
                  <ListItemIcon>
                    <CheckBoxOutlineBlankOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Select</ListItemText>
                </MenuItem>
                */}
                <MenuItem dense autoFocus onClick={() => {
                  handleContextClose()
                  handleFullScreenView(contextMedia)
                }}>
                  <ListItemIcon>
                    <VisibilityOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>View</ListItemText>
                  <Typography variant="body2" color="text.secondary">v</Typography>
                </MenuItem>
                <MenuItem dense onClick={() => {
                  handleContextClose()
                  handleDetailView(contextMedia)
                }}>
                  <ListItemIcon>
                    <EditOutlined fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Edit</ListItemText>
                  <Typography variant="body2" color="text.secondary">e</Typography>
                </MenuItem>
                <MenuItem dense onClick={() => {
                  handleContextClose()
                  removeItem(contextMedia.id)
                }}>
                  <ListItemIcon>
                    <DeleteOutline fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Remove</ListItemText>
                  <Typography variant="body2" color="text.secondary">r</Typography>
                </MenuItem>
                <Divider />
              </>
            }
            <ListSubheader>Global</ListSubheader>
            <MenuItem autoFocus={contextMedia == null} dense onClick={() => {
              handleContextClose()
              handleImport()
            }}>
              <ListItemIcon>
                <AddPhotoAlternateOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Import</ListItemText>
              <Typography variant="body2" color="text.secondary">i</Typography>
            </MenuItem>
            <Divider />
            <MenuItem dense onClick={() => {
              handleContextClose()
              handleSelectAll()
            }}>
              <ListItemIcon>
                <GridViewSharp fontSize="small" />
              </ListItemIcon>
              <ListItemText>Select all</ListItemText>
              <Typography variant="body2" color="text.secondary">a</Typography>
            </MenuItem>
            <MenuItem dense onClick={() => {
              handleContextClose()
              handleSelectNone()
            }}>
              <ListItemIcon>
                <GridViewOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Select none</ListItemText>
              <Typography variant="body2" color="text.secondary">n</Typography>
            </MenuItem>
            <Divider />
            <MenuItem dense onClick={() => {
              handleContextClose()
              handleRemoveSelected()
            }}>
              <ListItemIcon>
                <DeleteOutline fontSize="small" />
              </ListItemIcon>
              <ListItemText>
                <Badge badgeContent={items.filter((item: any) => item.selected).length} color="secondary">
                  Remove selected<Box style={{ width: '10px' }} />
                </Badge>
              </ListItemText>
              <Typography variant="body2" color="text.secondary">R</Typography>
            </MenuItem>
            <MenuItem dense onClick={(event) => {
              handleSortClick(event)
              handleContextClose()
            }}>
              <ListItemIcon>
                <SortOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Sort by</ListItemText>
              <Typography variant="body2" color="text.secondary">s</Typography>
            </MenuItem>
            <MenuItem dense onClick={() => {
              handleContextClose()
              handleResetItems()
            }}>
              <ListItemIcon>
                <CachedOutlined fontSize="small" />
              </ListItemIcon>
              <ListItemText>Reset</ListItemText>
              <Typography variant="body2" color="text.secondary">Z</Typography>
            </MenuItem>
            <Divider />
            {
              gridMode ?
                <MenuItem dense onClick={() => {
                handleContextClose()
                  setGridMode(false)
                }}>
                <ListItemIcon>
                  <ViewHeadlineOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText>List view</ListItemText>
                <Typography variant="body2" color="text.secondary">l</Typography>
              </MenuItem>
            :
              <MenuItem dense onClick={() => {
                handleContextClose()
                setGridMode(true)
              }}>
                <ListItemIcon>
                  <AppsOutlined fontSize="small" />
                </ListItemIcon>
                <ListItemText>Grid view</ListItemText>
                <Typography variant="body2" color="text.secondary">g</Typography>
              </MenuItem>
            }
        </Menu>

        {/* Main view */}
        <Box
          sx={{ w: '100%', pr: 2, pl: 2 }}
          onContextMenu={handleContextMenu}
        >
          {gridMode ? (

            // Grid view
            // TODO: move to components
            <Stack direction={'row'}>
              <Box sx={{ flexGrow: 1 }} />
              <ImageList cols={cols} gap={8} sx={{ p: '2px' }}>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={dragStart}
                  onDragEnd={dragEnd}
                  modifiers={[restrictToWindowEdges, restrictToParentElement]}
                >
                  <SortableContext items={items} strategy={rectSortingStrategy}>
                    {items.map((item: any, index: number) => (
                      <SortableListItem
                        key={item.img}
                        id={item.id}
                      >
                        <Box style={{ position: "relative" }}>
                          <img
                            src={`${item.img}?w=248&h=165&fit=crop&auto=format`}
                            srcSet={`${item.img}?w=248&h=165&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.title}
                            loading="lazy"
                            style={{ display: "block", width: '100%' }}
                            title="Click to zoom"
                            id={item.id}
                            onClick={() => handleFullScreenView(item)}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              color: "white",
                              position: "absolute",
                              top: 0,
                              left: 0,
                            }}
                            aria-label={`view fullscreen`}
                            title="Click to zoom"
                            onClick={() => handleFullScreenView(item)}
                          >
                            <VisibilityOutlined />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              color: "white",
                              position: "absolute",
                              top: 0,
                              right: 0,
                            }}
                            aria-label={`edit`}
                            title="Edit"
                            onClick={() => handleDetailView(item)}
                          >
                            <EditOutlined />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              color: "white",
                              position: "absolute",
                              bottom: 0,
                              left: 0,
                            }}
                            aria-label={`select ${item.title}`}
                            title="Select"
                            onClick={() => {selectItem(item.id)}}
                          >
                            {
                              item.selected ? <CheckBoxOutlined /> : <CheckBoxOutlineBlank />
                            }
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              color: "white",
                              position: "absolute",
                              bottom: 0,
                              right: 0,
                            }}
                            title="Remove"
                            aria-label={`delete`}
                            onClick={() => removeItem(item.id)}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </Box>
                        <ImageListItemBar
                          title={<Typography variant="subtitle1" noWrap>{item.title}</Typography>}
                          subtitle={<Typography variant="subtitle2" noWrap>by: {item.author}</Typography>}
                          sx={{ cursor: 'pointer', bgcolor: `${item.selected ? '#444' : ''}` }}
                          position="below"
                          onClick={() => selectItem(item.id)}
                        />
                      </SortableListItem>
                    ))}
                  </SortableContext>
                </DndContext>
              </ImageList>
              <Box sx={{ flexGrow: 1 }} />
            </Stack>
          ) : (
            // List view
            // TODO: move to components
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={dragStart}
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
                      <TableCell sx={{ borderBottom: "none" }} component="th" />
                      <TableCell sx={{ borderBottom: "none", color: "white", fontWeight: "bold" }} component="th">Media</TableCell>
                      <TableCell sx={{ borderBottom: "none", color: "white", fontWeight: "bold" }} component="th" align="left">Actions</TableCell>
                      <TableCell sx={{ borderBottom: "none", color: "white", fontWeight: "bold" }} component="th" align="left">Title</TableCell>
                      <TableCell sx={{ borderBottom: "none", color: "white", fontWeight: "bold" }} component="th" align="left">Author</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map((item: any, index: number) => (
                      <SortableTableRow
                        key={item.img}
                        id={item.id}
                      >
                        <TableCell
                          id={item.id}
                          sx={{ borderBottom: "none", bgcolor: `${item.selected ? '#444' : ''}` }}
                        >
                          <IconButton
                            sx={{ color: "white" }}
                            aria-label={`select`}
                            title="Select"
                            onClick={() => {selectItem(item.id)}}
                          >
                            {
                              item.selected ? <CheckBoxOutlined /> : <CheckBoxOutlineBlank />
                            }
                          </IconButton>
                        </TableCell>
                        <TableCell
                          id={item.id}
                          sx={{ borderBottom: "none", bgcolor: `${item.selected ? '#444' : ''}` }}
                        >
                          <img
                            src={`${item.img}?w=124&h=82&fit=crop&auto=format`}
                            srcSet={`${item.img}?w=124&h=82&fit=crop&auto=format&dpr=2 2x`}
                            alt={item.title}
                            title="Click to zoom"
                            onClick={() => handleFullScreenView(item)}
                            id={item.id}
                            loading="lazy"
                          />
                        </TableCell>
                        <TableCell align="left"
                          id={item.id}
                          sx={{ borderBottom: "none", bgcolor: `${item.selected ? '#444' : ''}` }}
                        >
                          <IconButton
                            sx={{ color: "white" }}
                            aria-label={`view fullscreen`}
                            title="Click to zoom"
                            onClick={() => handleFullScreenView(item)}
                          >
                            <VisibilityOutlined />
                          </IconButton>
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
                            onClick={() => removeItem(item.id)}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </TableCell>
                        <TableCell
                          sx={{ cursor: 'pointer', borderBottom: "none", bgcolor: `${item.selected ? '#444' : ''}`, color: "white" }}
                          id={item.id}
                          onClick={() => selectItem(item.id)}
                          align="left">
                          {item.title}
                        </TableCell>
                        <TableCell
                          sx={{cursor: 'pointer', borderBottom: "none", bgcolor: `${item.selected ? '#444' : ''}`, color: "white" }}
                          id={item.id}
                          onClick={() => selectItem(item.id)}
                          align="left">
                          {item.author}
                        </TableCell>
                      </SortableTableRow>
                    ))}
                  </TableBody>
                </Table>
              </SortableContext>
            </DndContext>
          )}
        </Box>

        {/* Image detail drawer */}
        {/* TODO: move to components */}
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
              src={`${currentMedia?.img}?w=2048&h=1365&fit=crop&auto=format`}
              srcSet={`${currentMedia?.img}?w=2048&h=1365&fit=crop&auto=format&dpr=2 2x`}
              alt={currentMedia?.title}
              title="Click to zoom"
              onClick={() => { currentMedia && handleFullScreenView(currentMedia) }}
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
              defaultValue={currentMedia?.dateModified && new Date(currentMedia.dateModified).toLocaleString()}
            />
            <TextField
              id="author"
              label="Author"
              variant="standard"
              defaultValue={currentMedia?.author}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhotoCameraFrontOutlined />
                  </InputAdornment>
                )
              }}
              onChange={(event) => {
                tempMedia && (tempMedia.author = event.target.value)
              }}
            />
            <TextField
              multiline
              rows={4}
              id="caption"
              label="Caption"
              variant="standard"
              defaultValue={currentMedia?.title}
              InputProps={{
                startAdornment: (
                  <InputAdornment style={{ display: 'flex', flexDirection: 'column-reverse' }} position="start" >
                    <NotesOutlined />
                  </InputAdornment>
                )
              }}
              onChange={(event) => {
                tempMedia && (tempMedia.title = event.target.value)
              }}
            />
            <Stack sx={{ pb: 4 }} direction={"row"}>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                sx={{ mr: 2 }}
                variant="contained"
                onClick={saveItem}
              >Save</Button>
              <Button
                variant="outlined"
                onClick={() => setDetailDrawerOpen(false)}
              >Cancel</Button>
            </Stack>
          </Stack>
        </SwipeableDrawer>

        {/* Import media drawer */}
        {/* TODO: move to components */}
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
            <Stack spacing={4}>
              {/* Tree View */}
              {/* TODO: replace with a dropdown tree select */}
              {repo && (
                <RichObjectTreeView folders={repo.folders} onChange={getEntries} />
              )}
              <Divider />
              <Stack sx={{ w: '100%' }}>
                <Stack sx={{ pb: 4 }} direction={"row"}>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton
                    size="small"
                    aria-label={`select all`}
                    title="Select all"
                    onClick={() => {
                      // TODO: move to function
                      const newItems = structuredClone(importItems)
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
                      // TODO: move to function
                      const newItems = structuredClone(importItems)
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

                {/* Import image list */}
                <ImageList cols={cols} rowHeight={200}>
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
                            onClick={() => {selectImportItem(item.id)}}
                          >
                            {
                              item.selected ? <CheckBoxOutlined /> : <CheckBoxOutlineBlank />
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
                onClick={importMedia}
              >Import</Button>
              <Button
                variant="outlined"
                onClick={
                  // TODO: move to function
                  () => setImportDrawerOpen(false)
                }
              >Cancel</Button>
            </Stack>
          </Stack>
        </SwipeableDrawer>
      </Box>
      <Box
        sx={{ width: '100%', flexGrow: 1 }}
        onContextMenu={handleContextMenu}
      />

      {/* Snack Bar for alerts */}
      {/* TODO: move to components */}
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "left"
        }}
        open={snackOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleSnackClose} severity={currentAlert?.severity} sx={{ width: '100%' }}>
          {currentAlert?.message}
        </Alert>
      </Snackbar>
    </ExtensionContextProvider>
  );
}

/**
 * Slide transition for alerts
 * TODO: move to components
 * @param props 
 * @returns 
 */
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

/**
 * Folders tree view
 * TODO: move to components
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
        <MediaGalleryApp />
      </header>
    </div>
  );
}

export default App;