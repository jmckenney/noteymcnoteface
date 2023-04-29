import React from "react";
import { Card } from "@mui/material";
import ConsultSummaryView from "./ConsultSummaryView";

export default function ConsultNote({ note, mode, setMode, anchorRef }) {
  const [expandedFullNote, setExpandedFullNote] = React.useState(false);

  const handleExpandFullNoteSummary = () => {
    setExpandedFullNote(!expandedFullNote);
  };

  return (
    <>
      <Card
        key={note._id}
        onDoubleClick={() => setMode("edit")}
        sx={
          // this logic is likely going to be "is this note for current consult"
          // rather than just "is this being edited at the time of a consult"
          // we may want to show the "view" next to consult too.
          mode === "edit" && anchorRef.current
            ? {
                position: "absolute",
                left: "98%",
                top: "0",
                width: "90%",
                pointerEvents: "all",
                maxHeight: "600px",
                overflowY: "scroll",
                boxShadow: 6,
                zIndex: -1,
              }
            : {}
        }
      >
        <ConsultSummaryView
          created={note.created}
          summary={note.summary}
          markdownOutputOfTemplate={note.markdownOutputOfTemplate}
          expandedFullNote={expandedFullNote}
          handleExpandFullNoteSummary={handleExpandFullNoteSummary}
        />
      </Card>
    </>
  );
}
