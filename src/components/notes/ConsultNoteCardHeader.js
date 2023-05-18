import React from "react";
import { CardHeader, Avatar, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RemoveIcon from "@mui/icons-material/Remove";
import { useMinimizeNoteContext } from "@/hooks/MinimizeNoteProvider";
import OpenInBrowserIcon from "@mui/icons-material/OpenInBrowser";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function ConsultNoteCardHeader({ created, showSizing = false }) {
  const { setIsNoteMinimized, isNoteMinimized } = useMinimizeNoteContext();
  return (
    <CardHeader
      avatar={<Avatar sx={{ bgcolor: "#8D42C8" }}>LS</Avatar>}
      action={
        <>
          {showSizing ? (
            <IconButton aria-label="settings">
              {isNoteMinimized ? (
                <OpenInBrowserIcon onClick={() => setIsNoteMinimized(false)} />
              ) : (
                <RemoveIcon onClick={() => setIsNoteMinimized(true)} />
              )}
            </IconButton>
          ) : (
            <> </>
          )}
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        </>
      }
      title="Consult Note"
      subheader={created ? formatter.format(new Date(created)) : ""}
    />
  );
}
