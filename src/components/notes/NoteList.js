import React, { useContext } from "react";
import { Stack } from "@mui/material";
import ConsultNoteSummary from "./ConsultNoteSummary";
import NoteContext from "@/hooks/TeamContext";

export default function NoteList({ notes }) {
  const { noteBeingEdited } = useContext(NoteContext);
  return (
    <Stack spacing={3}>
      {notes.length ? (
        notes.map((note) => {
          switch (note.noteType) {
            case "CONSULT_ENCOUNTER":
              return (
                <ConsultNoteSummary
                  key={note._id}
                  note={note}
                  beingEdited={
                    noteBeingEdited && noteBeingEdited._id === note._id
                  }
                />
              );

            default:
              break;
          }
        })
      ) : (
        <>Loading Notes...</>
      )}
    </Stack>
  );
}
