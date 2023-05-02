import React, { useState, useEffect, useContext } from "react";
import { Stack } from "@mui/material";
import ConsultNoteSummary from "./ConsultNoteSummary";
import NoteContext from "@/hooks/TeamContext";

export default function NoteList({ state }) {
  const [notes, setNotes] = useState([]);

  const { noteBeingEdited } = useContext(NoteContext);

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch(`/api/notes?state=${state}&limit=10`);
      const notesJson = await response.json();
      setNotes(notesJson);
    };
    fetchNotes();
  }, [state]);

  return (
    <Stack spacing={3}>
      {notes.length ? (
        notes.map((note) => {
          switch (note.noteType) {
            case "CONSULT_ENCOUNTER":
              return (
                <ConsultNoteSummary
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
