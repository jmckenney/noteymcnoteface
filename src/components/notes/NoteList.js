import React, { useState, useEffect } from "react";
import { Stack } from "@mui/material";
import ConsultNoteDockableContainer from "./ConsultNoteDockableContainer";

export default function NoteList({ state }) {
  const [notes, setNotes] = useState([]);

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
              return <ConsultNoteDockableContainer note={note} />;

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
