import React, { useState, useEffect } from "react";
import { Card, Stack } from "@mui/material";

export default function NoteList({ state }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch(`/api/notes?state=${state}`);
      const notesJson = await response.json();
      setNotes(notesJson);
    };
    fetchNotes();
  }, [state]);

  return (
    <Stack spacing={3}>
      {notes.length ? (
        notes.map((note) => (
          <Card key="note._id" sx={{ p: 3 }}>
            <p>{note.noteType}</p>
          </Card>
        ))
      ) : (
        <>Loading Template...</>
      )}
    </Stack>
  );
}
