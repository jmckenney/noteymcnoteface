import React, { useContext } from "react";
import { Card } from "@mui/material";
import ConsultSummaryView from "./ConsultSummaryView";
import NoteContext from "@/hooks/NoteContext";

export default function ConsultNoteSummary({ note }) {
  const [expandedFullNote, setExpandedFullNote] = React.useState(false);
  const { setNoteBeingEdited } = useContext(NoteContext);

  const handleExpandFullNoteSummary = () => {
    setExpandedFullNote(!expandedFullNote);
  };

  return (
    <>
      <Card key={note._id} onDoubleClick={() => setNoteBeingEdited(note)}>
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
