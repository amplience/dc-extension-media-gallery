import "./media-gallery.css"
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
  ZoomInOutlined,
  ZoomOutOutlined,
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
import SortableListItem from "../sortable-list-item"
import SortableTableRow from "../sortable-table-row"
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
import { useExtension } from "../extension-context";
import { GqlChApi } from "../ch-api/gql-ch-api";
import { assetsToItems, convertToEntry } from "../model/conversion";
import { Box } from "@mui/material";
import { Stack } from "@mui/system";
import { SlideProps } from '@mui/material/Slide';

import Entry from '../model/entry';
import { EnrichedRepository, Folder } from "../ch-api/shared";

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
  entry: Entry;
}

/**
 * Alert message
 */
interface AlertMessage {
  severity: AlertColor
  message: string
}

/*
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
*/

function assetToImg(asset: Entry): string {
  // TODO: use vse?
  const vse = '1v8j1gmgsolq81dxx8zx7pdehf.staging.bigcontent.io';

  return `https://${vse ?? asset.photo.defaultHost}/i/${asset.photo.endpoint}/${asset.photo.name}`;
}

function itemsToAssets(items: MediaItem[]): Entry[] {
  return items.map(item => item.entry as Entry);
}

function MediaGallery() {
  const { field, setField, params } = useExtension();

  const { galleryPath, configPath } = params;

  console.log(galleryPath)

  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  // const isLarge = useMediaQuery(theme.breakpoints.down("lg"));
  // const isXLarge = useMediaQuery(theme.breakpoints.down("xl"));

  // const [cols, setCols] = useState(6);

  const [zoom, setZoom] = useState(1);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [importItems, setImportItems] = useState<MediaItem[]>([]);
  const [gridMode, setGridMode] = useState(true);
  const [repo, setRepo] = useState<EnrichedRepository>();
  const [chApi, setChApi] = useState<GqlChApi>();
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

  useEffect(() => {
    if (field) {
      const data = assetsToItems(field[galleryPath], params);
      setItems(data);
    }
  }, [field])

  useEffect(() => {
    if (field) {
      field[galleryPath] = itemsToAssets(items);
      if (setField) {
        setField();
      }
    }
  }, [field, setField, items]);

  const setDefaultFolder = (repoId: string, folderId: string) => {
    // Should also clear the last used query here if it's being replaced with a folder.

    field[configPath].repoId = repoId;
    field[configPath].folderId = folderId;

    if (setField) {
      setField();
    }
  }

  /**
   * re-calculate cols
   */
  // useEffect(() => {
  //   function handleResize() {
  //     if (isXLarge) setCols(Math.floor(6*zoom))
  //     if (isLarge) setCols(Math.floor(4*zoom))
  //     if (isTablet) setCols(Math.floor(3*zoom))
  //     if (isMobile) setCols(Math.floor(2*zoom))
  //   }
  //   window.addEventListener('resize', handleResize)
  // })

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
   * Zoom in for grid mode
   */
  const handleZoomIn = () => {
    if (zoom < 2) {
      setZoom(zoom * 2)
    }
  }

  /**
   * Zoom out for grid mode
   */
  const handleZoomOut = () => {
    if (zoom > 1/2) {
      setZoom(zoom / 2)
    }
  }

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
  const getEntries = async (id: string): Promise<Entry[]> => {
    if (chApi && repo) {
      const assets = await chApi.getExifByFolder(repo.id, id);

      const entries = assets.map((asset) =>
        convertToEntry(asset, params.exifMap, {
          endpoint: "nmrsaalphatest",
          defaultHost: "cdn.media.amplience.net",
        })
      );

      return entries;
    }

    return [];
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
        } else if (event.key === ' ') {
          event.preventDefault()
          const element = document.activeElement as HTMLElement
          const id = parseInt(element.id)
          if (id) {
            selectItem(id) // Not working
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
        // } else if (event.key === 'ArrowDown' && gridMode) {
        //   offsetActiveElementIndex(Math.floor(cols / zoom))
        // } else if (event.key === 'ArrowUp' && gridMode) {
        //   offsetActiveElementIndex(Math.floor(-cols / zoom))
        } else if (event.key === '-' && gridMode) {
          handleZoomOut()
        } else if (event.key === '+' && gridMode) {
          handleZoomIn()
        // } else if (event.key === 'ArrowDown' && !gridMode) {
        //   offsetActiveElementIndex(1) 
        // } else if (event.key === 'ArrowUp' && !gridMode) {
        //   offsetActiveElementIndex(-1)
        }
      } else if (importDrawerOpen) {
        if (event.key.toLowerCase() === 'a') {
          handleSelectAllImportItems()
        } else if (event.key.toLowerCase() === 'n') {
          handleSelectNoneImportItems()
        }
      } else if (fullscreenView && event.key.toLowerCase() === 'i') {
        setInfoPanelOpen(!infoPanelOpen)
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  });

  /** 
   * Getting folders from Content Hub
   */
  useEffect(() => {
    (async () => {
      if (params.clientId) {
        const gqlTest = new GqlChApi(
          "https://auth.amplience.net/oauth/token",
          "https://api.amplience.net/graphql"
        );
        await gqlTest.auth(params.clientId, params.clientSecret);
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
        const newItem = structuredClone(item)
        if (item.id === id) {
          newItem.selected = !item.selected
        }
        return newItem
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
    setItems([])
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
    /*
    const newItems = structuredClone(importItems)
    newItems.map((element: MediaItem) => {
      element.selected = false
      return element
    })
    */
    setImportItems([])
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
        if (item.id === tempMedia.id) {
          tempMedia.entry[params.displayDescription] = tempMedia.title;
          tempMedia.entry[params.displayAuthor] = tempMedia.author;
          item = tempMedia;
        }
        return item
      })
    })
    setCurrentAlert({
      severity: "success",
      message: "Media details successfully saved!"
    })
    setTimeout(() => { handleSnackOpen() }, 500)
  }

  /**
   * Sort by date asc
   */
  const handleSortByDateAsc = () => {
    setItems((prevState: MediaItem[]) => {
      return prevState.slice().sort((a: any, b: any) => (new Date(a.dateModified).getTime() - new Date(b.dateModified).getTime()))
    })
    handleSortClose()
  }

  /**
   * Sort by date desc
   */
  const handleSortByDateDesc = () => {
    setItems((prevState: MediaItem[]) => {
      return prevState.slice().sort((a: any, b: any) => (new Date(b.dateModified).getTime() - new Date(a.dateModified).getTime()))
    })
    handleSortClose()
  }

  /**
   * Sort by author asc
   */
  const handleSortByAuthorAsc = () => {
    setItems((prevState: MediaItem[]) => {
      return prevState.slice().sort((a: any, b: any) => (a.author > b.author) ? 1 : ((b.author > a.author) ? -1 : 0))
    })
    handleSortClose()
  }

  /**
   * Sort by author desc
   */
  const handleSortByAuthorDesc = () => {
    setItems((prevState: MediaItem[]) => {
      return prevState.slice().sort((a: any, b: any) => (b.author > a.author) ? 1 : ((a.author > b.author) ? -1 : 0))
    })
    handleSortClose()
  }

  /**
   * Sort by caption asc
   */
  const handleSortByCaptionAsc = () => {
    setItems((prevState: MediaItem[]) => {
      return prevState.slice().sort((a: any, b: any) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
    })
    handleSortClose()
  }

  /**
   * Sort by caption desc
   */
  const handleSortByCaptionDesc = () => {
    setItems((prevState: MediaItem[]) => {
      return prevState.slice().sort((a: any, b: any) => (b.title > a.title) ? 1 : ((a.title > b.title) ? -1 : 0))
    })
    handleSortClose()
  }

  /**
   * Select all import items
   */
  const handleSelectAllImportItems = () => {
    setImportItems((prevState: MediaItem[]) => {
      return prevState.map((element: MediaItem) => {
        element.selected = true
        return element
      })
    })
  }

  /**
   * De-select all import items
   */
  const handleSelectNoneImportItems =() => {
    setImportItems((prevState: MediaItem[]) => {
      return prevState.map((element: MediaItem) => {
        element.selected = false
        return element
      })
    })
  }

  return (
    <>
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
            <IconButton 
              edge="start" 
              color="inherit" 
              aria-label="menu" 
              sx={{ mr: 2 }} 
              onClick={(event) => handleContextMenu(event)}
            >
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
                <MenuItem dense autoFocus onClick={handleSortByDateAsc}>
                  <ListItemIcon><ArrowUpwardOutlined fontSize="small" /></ListItemIcon>
                  <ListItemText>Date Modified Asc</ListItemText>
                </MenuItem>
                <MenuItem dense onClick={handleSortByDateDesc}>
                  <ListItemIcon><ArrowDownwardOutlined fontSize="small" /></ListItemIcon>
                  <ListItemText>Date Modified Desc</ListItemText>
                </MenuItem>
                <MenuItem dense onClick={handleSortByAuthorAsc}>
                  <ListItemIcon><ArrowUpwardOutlined fontSize="small" /></ListItemIcon>
                  <ListItemText>Author Asc</ListItemText>
                </MenuItem>
                <MenuItem dense onClick={handleSortByAuthorDesc}>
                  <ListItemIcon><ArrowDownwardOutlined fontSize="small" /></ListItemIcon>
                  <ListItemText>Author Desc</ListItemText>
                </MenuItem>
                <MenuItem dense onClick={handleSortByCaptionAsc}>
                  <ListItemIcon><ArrowUpwardOutlined fontSize="small" /></ListItemIcon>
                  <ListItemText>Caption Asc</ListItemText>
                </MenuItem>
                <MenuItem dense onClick={handleSortByCaptionDesc}>
                  <ListItemIcon><ArrowDownwardOutlined fontSize="small" /></ListItemIcon>
                  <ListItemText>Caption Desc</ListItemText>
                </MenuItem>
            </Menu>
            <Divider
              orientation="vertical"
              variant="middle"
              sx={{ ml: 1, mr: 1 }}
              flexItem />
            <IconButton
              sx={{ color: "white" }}
              aria-label={`zoonm in`}
              title="Zoom In"
              disabled={zoom === 2 || !gridMode}
              onClick={handleZoomIn}
            >
              <ZoomInOutlined />
            </IconButton>
            <IconButton
              sx={{ color: "white" }}
              aria-label={`zoonm out`}
              title="Zoom Out"
              disabled={zoom === 1/2 || !gridMode}
              onClick={handleZoomOut}
            >
              <ZoomOutOutlined />
            </IconButton>
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
                {
                 !contextMedia.selected &&
                 <MenuItem dense onClick={() => {
                    handleContextClose()
                    selectItem(contextMedia.id)
                  }}> 
                    <ListItemIcon>
                      <CheckBoxOutlineBlank fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Select</ListItemText>
                    <Typography variant="body2" color="text.secondary">Space</Typography>
                  </MenuItem>
                }
                {
                 contextMedia.selected &&
                 <MenuItem dense onClick={() => {
                    handleContextClose()
                    selectItem(contextMedia.id)
                  }}> 
                    <ListItemIcon>
                      <CheckBoxOutlined fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>De-select</ListItemText>
                    <Typography variant="body2" color="text.secondary">Space</Typography>
                  </MenuItem>
                }
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
            <MenuItem disabled={zoom === 2 || !gridMode} dense onClick={() => {
                handleContextClose()
                handleZoomIn()
              }}>
              <ListItemIcon>
                <ZoomInOutlined />
              </ListItemIcon>
              <ListItemText>Zoom In</ListItemText>
              <Typography variant="body2" color="text.secondary">+</Typography>
            </MenuItem> 
            <MenuItem disabled={zoom === 1/2 || !gridMode} dense onClick={() => {
                handleContextClose()
                handleZoomOut()
              }}>
              <ListItemIcon>
                <ZoomOutOutlined />
              </ListItemIcon>
              <ListItemText>Zoom Out</ListItemText>
              <Typography variant="body2" color="text.secondary">-</Typography>
            </MenuItem> 
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
              {/* <ImageList cols={Math.floor(cols / zoom)} gap={8} sx={{ p: '2px' }}> */}
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', p:1 }}>
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
                        zoom={zoom}
                      >
                        <Box sx={{mt:1, ml:1, mr:1}} style={{ position: "relative" }}>
                          <img
                            src={`${item.img}?w=${248*zoom}&h=${164*zoom}&sm=c&auto=format`}
                            srcSet={`${item.img}?w=${248*zoom}&h=${164*zoom}&sm=c&auto=format&dpr=2 2x`}
                            alt={item.title}
                            loading="lazy"
                            style={{ width: '100%', aspectRatio:'1.5/1' }}
                            title="Click to zoom"
                            id={item.id}
                            onClick={() => handleFullScreenView(item)}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              color: "white",
                              position: "absolute",
                              top: 4,
                              left: 4,
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
                              top: 4,
                              right: 4,
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
                              bottom: 4,
                              left: 4,
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
                              bottom: 4,
                              right: 4,
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
                          sx={{ p: 0, mb: 1, ml: 1, mr: 1, cursor: 'pointer', bgcolor: `${item.selected ? '#444' : ''}` }}
                          position="below"
                          onClick={() => selectItem(item.id)}
                        />
                      </SortableListItem>
                    ))}
                  </SortableContext>
                </DndContext>
              </Box>
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
                            src={`${item.img}?w=124&h=82&sm=c&auto=format`}
                            srcSet={`${item.img}?w=124&h=82&sm=c&auto=format&dpr=2 2x`}
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
                <RichObjectTreeView folders={repo.folders} onChange={async (id: string) => {
                  const entries = await getEntries(id);

                  setDefaultFolder(repo.id, id);

                  setImportItems(assetsToItems(entries, params));
                }} />
              )}
              <Divider />
              <Stack sx={{ w: '100%' }}>
                <Stack sx={{ pb: 4 }} direction={"row"}>
                  <Box sx={{ flexGrow: 1 }} />
                  <IconButton
                    size="small"
                    aria-label={`select all`}
                    title="Select all"
                    onClick={handleSelectAllImportItems}
                  >
                    <GridViewSharp />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label={`select none`}
                    title="Select none"
                    onClick={handleSelectNoneImportItems}
                  >
                    <GridViewOutlined />
                  </IconButton>
                </Stack>

                {/* Import image list */}
                {/* TODO: move to flex wrap */}
                <ImageList cols={5}>
                  {importItems.map((item: any) => (
                    <ImageListItem
                      key={item.img}
                    >
                      <img
                        src={`${item.img}?w=150&h=100&sm=c&auto=format`}
                        srcSet={`${item.img}?w=150&h=100&sm=c&auto=format&dpr=2 2x`}
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
            <Stack sx={{ pb: 4, pt: 4, position: 'sticky', backgroundColor: 'white' }} direction={"row"}>
              <Box sx={{ flexGrow: 1 }} />
              <Button
                sx={{ mr: 2 }}
                variant="contained"
                onClick={importMedia}
              >Import</Button>
              <Button
                variant="outlined"
                onClick={() => setImportDrawerOpen(false)}
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
    </>
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

export default MediaGallery;