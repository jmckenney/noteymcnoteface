import React, { useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import Header from "@/layouts/dashboard/header";
import Nav from "@/layouts/dashboard/nav";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import NoteContext from "@/hooks/NoteContext";
import DraggableNoteEditorContainer from "@/components/notes/DraggableNoteEditorContainer";
import ConsultNoteDockableContainer from "@/components/notes/ConsultNoteDockableContainer";

export default function PageContainer({
  title,
  videoButton,
  onVideoButtonClick,
  children,
}) {
  const [noteBeingEdited, setNoteBeingEdited] = useState(null);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={3} mt={8} sx={{ display: { xs: "none", sm: "block" } }}>
          <Nav />
        </Grid>
        <Grid item xs={12} sm={9} mt={8}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            {title}
            {videoButton && (
              <VideoCameraFrontIcon
                onClick={onVideoButtonClick}
                sx={{ ml: 2, cursor: "pointer" }}
              />
            )}
          </Typography>
          <NoteContext.Provider value={{ setNoteBeingEdited }}>
            {children}
            <div>
              {noteBeingEdited && (
                <DraggableNoteEditorContainer>
                  <ConsultNoteDockableContainer note={noteBeingEdited} />
                </DraggableNoteEditorContainer>
              )}
            </div>
          </NoteContext.Provider>
        </Grid>
      </Grid>
    </Container>
  );
}
