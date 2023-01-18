import {
  CloseOutlined,
  GridViewSharp,
  GridViewOutlined,
  CheckBoxOutlined,
  CheckBoxOutlineBlank,
} from "@mui/icons-material";
import {
  SwipeableDrawer,
  Stack,
  Typography,
  Box,
  IconButton,
  Divider,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import RichObjectTreeView from "./RichTreeView";
import { AppContext } from "../app-context";
import { useContext, useEffect, useState } from "react";
import { assetsToItems } from "../model/conversion";
import GenericImage from './GenericImage'
import { useExtension } from "../extension-context";
import { MediaItem } from "../model";

const ImportDrawer = () => {
  const app = useContext(AppContext);
  const { params, field, oldConfig } = useExtension();

  const [queryValue, setQueryValue] = useState<string | undefined>(undefined);
  const [folderId, setFolderId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  let folder: string | undefined = undefined;
  let query: string | undefined = undefined;

  if (oldConfig) {
    folder = oldConfig.folderId;
    query = oldConfig.query;
  }

  useEffect(() => {
    setFolderId(folder);
    setQueryValue(query);
    console.log('fk ' + query);
  }, [folder, query]);

  useEffect(() => {
    if (app.importDrawerOpen) {
      let cancelled = false;

      (async () => {
        if (app.getEntries && app.setImportItems && folderId) {
          setLoading(true);
          const entries = await app.getEntries(folderId, queryValue);
          if (!cancelled) {
            app.setImportItems(assetsToItems(entries, params)
              .map((item: MediaItem) => {
                if (app.items.filter((item2: MediaItem) => item2.id === item.id).length > 0) {
                  item.disabled = true
                }
                return item
              }));
            
            setLoading(false);
          }
        }
      })();
  
      return () => { cancelled = true; }
    }

    // shouldn't rerun when app changes
  }, [queryValue, folderId, setLoading, params, app.importDrawerOpen]);

  return (
    <SwipeableDrawer
      PaperProps={{
        sx: { width: "90%" },
      }}
      anchor={"left"}
      open={app.importDrawerOpen}
      onClose={() => {
        if (app.setImportDrawerOpen) app.setImportDrawerOpen(false);
      }}
      onOpen={() => {
        if (app.setImportDrawerOpen) app.setImportDrawerOpen(true);
      }}
    >
      <Stack spacing={2} sx={{ h: "100%", p: 0 }}>
        <Stack direction={"row"} sx={{position:'sticky', top:0, backgroundColor:'white', zIndex:100, p:2}}>
          <Typography sx={{ pb: 2 }} variant="h5" component="h5">
            Import Media
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconButton
              aria-label={`close import drawer`}
              size="small"
              onClick={() => {
                if (app.setImportDrawerOpen) app.setImportDrawerOpen(false);
              }}
            >
              <CloseOutlined />
            </IconButton>
          </Box>
        </Stack>
        <Stack spacing={4} sx={{p:2, paddingTop:0}}>
          {/* Tree View */}
          {/* TODO: replace with a dropdown tree select */}
          {app.repo && (
            <RichObjectTreeView
              folders={app.repo?.folders}
              onChange={async (id: string) => {
                setFolderId(id);
              }}
              selectedId={folderId}
            />
          )}
          <TextField
            key={query}
            label="Query"
            helperText="Query to filter assets in the folder with."
            defaultValue={query}
            onChange={(event) => {
              setQueryValue(event.target.value);
            }}
          ></TextField>
          <Divider />
          <Stack sx={{ w: "100%" }}>
            <Stack sx={{ pb: 4 }} direction={"row"}>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                size="small"
                aria-label={`select all`}
                title="Select all"
                onClick={app.handleSelectAllImportItems}
              >
                <GridViewSharp />
              </IconButton>
              <IconButton
                size="small"
                aria-label={`select none`}
                title="Select none"
                onClick={app.handleSelectNoneImportItems}
              >
                <GridViewOutlined />
              </IconButton>
            </Stack>

            {/* Import image list */}
            {/* TODO: move to flex wrap */}
            {loading ? (
              <div style={{height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <CircularProgress />
              </div>
            ) : (
              app.importItems && (
                <ImageList cols={5}>
                  {app.importItems.map((item: MediaItem) => (
                    <ImageListItem key={item.img}>
                      <GenericImage 
                        item={item} 
                        w={150} 
                        disabled={item.disabled}
                        zoomable={true} 
                        aspect={{w:3,h:2}} 
                        lazy={false} 
                        fillWidth={true}
                      />
                      <ImageListItemBar
                        title={item.title}
                        subtitle={<span>by: {item.author}</span>}
                        style={{color: `${item.disabled ? '#bbb' : '#000'}`}}
                        position="below"
                        actionIcon={
                          <IconButton
                            aria-label={`select ${item.title}`}
                            title="Select"
                            disabled={item.disabled}
                            onClick={() => {
                              app.selectImportItem(item.id);
                            }}
                          >
                            {item.selected ? (
                              <CheckBoxOutlined />
                            ) : (
                              <CheckBoxOutlineBlank />
                            )}
                          </IconButton>
                        }
                        actionPosition="left"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              )
            )}
          </Stack>
        </Stack>
        <Stack
          sx={{
            pb: 4,
            pt: 2,
            p:2,
            position: "sticky",
            backgroundColor: "white",
            bottom: 0,
          }}
          direction={"row"}
        >
          <Box sx={{ flexGrow: 1 }} />
          <Button sx={{ mr: 2 }} variant="contained" onClick={app.importMedia}>
            Import
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              if (app.setImportDrawerOpen) app.setImportDrawerOpen(false);
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Stack>
    </SwipeableDrawer>
  );
};

export default ImportDrawer;
