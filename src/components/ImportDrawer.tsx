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

const ImportDrawer = () => {
  const app = useContext(AppContext);
  const [queryValue, setQueryValue] = useState<string | undefined>(undefined);
  const [folderId, setFolderId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (app.getEntries && app.setImportItems && folderId) {
        setLoading(true);
        const entries = await app.getEntries(folderId, queryValue);
        if (!cancelled) {
          app.setImportItems(assetsToItems(entries));
          setLoading(false);
        }
      }
    })();

    return () => { cancelled = true; }

    // shouldn't rerun when app changes
  }, [queryValue, folderId, setLoading]);

  return (
    <SwipeableDrawer
      PaperProps={{
        sx: { width: "90%", p: 2 },
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
      <Stack spacing={2} sx={{ h: "100%" }}>
        <Stack direction={"row"}>
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
        <Stack spacing={4}>
          {/* Tree View */}
          {/* TODO: replace with a dropdown tree select */}
          {app.repo && (
            <RichObjectTreeView
              folders={app.repo?.folders}
              onChange={async (id: string) => {
                setFolderId(id);
              }}
            />
          )}
          <TextField
            label="Query"
            helperText="Query to filter assets in the folder with."
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
                  {app.importItems.map((item: any) => (
                    <ImageListItem key={item.img}>
                      <img
                        src={`${item.img}?w=150&h=100&sm=clamp&fmt=auto&qlt=60&fmt.jpeg.interlaced=true`}
                        srcSet={`${item.img}?w=300&h=200&sm=clamp&fmt=auto&qlt=60&fmt.jpeg.interlaced=true 2x`}
                        alt={item.title}
                        onClick={() => app.handleFullScreenView(item)}
                        style={{ aspectRatio: 1.5 / 1, cursor: "zoom-in" }}
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
