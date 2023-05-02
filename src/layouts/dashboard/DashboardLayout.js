import React, { useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import Header from "@/layouts/dashboard/header";
import Nav from "@/layouts/dashboard/nav";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import TeamContext from "@/hooks/TeamContext";
import DraggableNoteEditorContainer from "@/components/notes/DraggableNoteEditorContainer";
import ConsultNoteDockableContainer from "@/components/notes/ConsultNoteDockableContainer";
import MockVideoConsultWindow from "@/components/MockVideoConsultWindow";

export default function PageContainer({ children, title = "" }) {
  const [noteBeingEdited, setNoteBeingEdited] = useState(null);
  const [showVideoConsult, setShowVideoConsult] = useState(false);
  const [showMemberName, setShowMemberName] = useState(false);
  return (
    <>
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Header />
          </Grid>
          <Grid
            item
            xs={3}
            mt={8}
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <Nav />
          </Grid>
          <Grid item xs={12} sm={9} mt={8}>
            {showMemberName && (
              <Typography variant="h4" sx={{ mb: 5 }}>
                Tristan Templeton
                {true && (
                  <VideoCameraFrontIcon
                    onClick={() => setShowVideoConsult(!showVideoConsult)}
                    sx={{ ml: 2, cursor: "pointer" }}
                  />
                )}
              </Typography>
            )}

            <TeamContext.Provider
              value={{ setNoteBeingEdited, noteBeingEdited, setShowMemberName }}
            >
              {children}
              <div>
                {noteBeingEdited && (
                  <DraggableNoteEditorContainer>
                    <ConsultNoteDockableContainer note={noteBeingEdited} />
                  </DraggableNoteEditorContainer>
                )}
              </div>
            </TeamContext.Provider>
          </Grid>
        </Grid>
      </Container>
      {showVideoConsult && <MockVideoConsultWindow />}
    </>
  );
}
