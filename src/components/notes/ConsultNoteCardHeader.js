import React from "react";
import { CardHeader, Avatar, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function ConsultNoteCardHeader({ created }) {
  return (
    <CardHeader
      avatar={<Avatar sx={{ bgcolor: "#8D42C8" }}>LS</Avatar>}
      action={
        <IconButton aria-label="settings">
          <MoreVertIcon />
        </IconButton>
      }
      title="Consult Note"
      subheader={created ? formatter.format(new Date(created)) : ""}
    />
  );
}
