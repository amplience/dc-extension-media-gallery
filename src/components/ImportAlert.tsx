import { Alert } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../app-context";
import { useExtension } from "../extension-context";
import { MediaItem } from "../model";
import { assetsToItems } from "../model/conversion";
import _ from "lodash";

const ImportAlert = () => {
  const app = useContext(AppContext);
  const { params } = useExtension();

  const [updated, setUpdated] = useState(0);
  const [outOfSync, setOutOfSync] = useState(0);

  useEffect(() => {
    if (app.entries && app.items) {
      let updatedCount = 0;
      let outOfSyncCount = 0;

      assetsToItems(app.entries, params).forEach((item: MediaItem) => {
        const filtered = app.items.filter(
          (item2: MediaItem) => item2.id === item.id
        );
        if (filtered.length > 0) {
          filtered.forEach((fItem: MediaItem) => {
            if (fItem.id === item.id) {
              if (fItem.dateModified < item.dateModified) {
                updatedCount++;
              } else if (!_.isEqual(fItem.entry, item.entry)) {
                outOfSyncCount++;
              }
            }
          });
        }
      });

      setUpdated(updatedCount);
      setOutOfSync(outOfSyncCount);
    }
  }, [app.entries, app.items, params]);

  const showAlert = updated + outOfSync > 0;
  const alertOffset = showAlert ? 0 : -48;

  const messages = [];

  if (updated > 0) {
    messages.push(`${updated} updated since last import`)
  }

  if (outOfSync > 0) {
    messages.push(`${outOfSync} out-of-sync`)
  }

  return (
    <Alert
      severity="info"
      sx={{
        transition: "0.5s margin",
        marginTop: alertOffset + "px",
        height: "36px",
      }}
    >
      Import panel has changes: {messages.join(', ')}
    </Alert>
  );
};

export default ImportAlert;
