import React, { useContext } from "react";
import { Box, Card } from "@mui/material";
import ConsultSummaryView from "./ConsultSummaryView";
import NoteContext from "@/hooks/TeamContext";

export default function ConsultNoteSummary({ note, beingEdited }) {
  const [expandedFullNote, setExpandedFullNote] = React.useState(false);
  const { setNoteBeingEdited } = useContext(NoteContext);

  const handleExpandFullNoteSummary = () => {
    setExpandedFullNote(!expandedFullNote);
  };

  return (
    <>
      <Card key={note._id} onDoubleClick={() => setNoteBeingEdited(note)}>
        {beingEdited && (
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
              textAlign: "center",
              boxShadow: 3,
              backgroundColor: "white",
              borderRadius: 2,
              padding: 2,
            }}
          >
            <strong>
              Currently
              <br />
              being
              <br />
              Edited.
            </strong>
          </Box>
        )}
        <Box sx={beingEdited ? { opacity: ".2" } : {}}>
          <ConsultSummaryView
            created={note.created}
            summary={note.summary}
            markdownOutputOfTemplate={note.markdownOutputOfTemplate}
            expandedFullNote={expandedFullNote}
            handleExpandFullNoteSummary={handleExpandFullNoteSummary}
          />
        </Box>
      </Card>
    </>
  );
}
