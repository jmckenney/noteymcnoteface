import React, { useState, useCallback } from "react";
import { Container, Grid, Typography } from "@mui/material";
import Header from "@/layouts/dashboard/header";
import Nav from "@/layouts/dashboard/nav";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import TeamContext from "@/hooks/TeamContext";
import NotesContext from "@/hooks/NotesContext";
import { DictationProvider } from "@/hooks/DictationContext";
import DraggableNoteEditorContainer from "@/components/notes/DraggableNoteEditorContainer";
import ConsultNoteDockableContainer from "@/components/notes/ConsultNoteDockableContainer";
import MockVideoConsultWindow from "@/components/MockVideoConsultWindow";

import { useMinimizeNoteContext } from "@/hooks/MinimizeNoteProvider";

export default function PageContainer({ children, title = "" }) {
  const [noteBeingEdited, setNoteBeingEdited] = useState(null);
  const [showVideoConsult, setShowVideoConsult] = useState(false);
  const [showMemberName, setShowMemberName] = useState(false);
  const [notes, setNotes] = useState([]);
  const [filterBy, setFilterBy] = useState("IN_PROGRESS");
  const fetchNotes = useCallback(async () => {
    const response = await fetch(`/api/notes?state=${filterBy}&limit=10`);
    const notesJson = await response.json();
    setNotes(notesJson);
  }, [filterBy, setNotes]);

  const { isNoteMinimized } = useMinimizeNoteContext();

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
                <VideoCameraFrontIcon
                  onClick={() => setShowVideoConsult(!showVideoConsult)}
                  sx={{ ml: 2, cursor: "pointer" }}
                />
              </Typography>
            )}
            <DictationProvider>
              <TeamContext.Provider
                value={{
                  setNoteBeingEdited,
                  noteBeingEdited,
                  setShowMemberName,
                }}
              >
                <NotesContext.Provider
                  value={{
                    notes,
                    setNotes,
                    fetchNotes,
                    filterBy,
                    setFilterBy,
                  }}
                >
                  {children}
                  <div>
                    {noteBeingEdited && (
                      <>
                        {isNoteMinimized ? (
                          <div
                            style={{
                              position: "absolute",
                              height: "100px",
                              left: "50%",
                              transform: "translateX(-50%)",
                              bottom: "0",
                              top: "auto",
                              overflow: "hidden",
                            }}
                          >
                            <ConsultNoteDockableContainer
                              note={noteBeingEdited}
                            />
                          </div>
                        ) : (
                          <DraggableNoteEditorContainer>
                            <ConsultNoteDockableContainer
                              note={noteBeingEdited}
                            />
                          </DraggableNoteEditorContainer>
                        )}
                      </>
                    )}
                  </div>
                </NotesContext.Provider>
              </TeamContext.Provider>
            </DictationProvider>
          </Grid>
        </Grid>
      </Container>
      {showVideoConsult && <MockVideoConsultWindow />}
    </>
  );
}
