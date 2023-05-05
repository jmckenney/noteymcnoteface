import React, { useContext, useEffect, useCallback, useState } from "react";
import {
  Button,
  Box,
  Card,
  Chip,
  Stack,
  Typography,
  TextField,
  CardContent,
  Collapse,
  Divider,
  FormControl,
  Select,
  MenuItem,
  Slide,
  Grid,
} from "@mui/material";
import TemplateMetricPoint from "../template-parts/TemplateMetricPoint";
import debounce from "lodash/debounce";
import { formatTemplateOutputToMarkdown } from "@/components/templates/formatTemplateOutputToMarkdown";
import SyncIcon from "@mui/icons-material/Sync";
import Fade from "@mui/material/Fade";
import ConsultNoteCardHeader from "./ConsultNoteCardHeader";
import NoteAreaExpanderHeading from "./NoteAreaExpanderHeading";
import ThinkingEloquently from "../animations/ThinkingEloquently";
import TeamContext from "@/hooks/TeamContext";
import NotesContext from "@/hooks/NotesContext";

export default function ConsultNoteEditor({
  note = {},
  draggableVideoConsultAnchorRef,
}) {
  const [expandedMetrics, setExpandedMetrics] = React.useState(false);
  const [expandedRecommendations, setExpandedRecommendations] =
    React.useState(false);
  const [template, setTemplate] = useState(note.noteTemplate);
  const [saving, setSaving] = useState(false);
  const [llmProcessing, setLlmProcessing] = useState(false);
  const [expandedCustomItems, setExpandedCustomItems] = useState({});
  const { setNoteBeingEdited } = useContext(TeamContext);
  const { fetchNotes } = useContext(NotesContext);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showDynamicallyAddedItemsLabel, setShowDynamicallyAddedItemsLabel] =
    useState(false);

  const handleMetricsClick = useCallback(() => {
    setExpandedMetrics(!expandedMetrics);
  }, [expandedMetrics]);

  const handleRecommendationsClick = useCallback(() => {
    setExpandedRecommendations(!expandedRecommendations);
  }, [expandedRecommendations]);

  useEffect(() => {
    const noteId = note?._id;
    if (noteId) {
      /**
       * Poll for changes to note. If recommendations, setRecommendations(true)
       * For now, just keep on polling:)
       */
      const interval = setInterval(async () => {
        const noteResponse = await fetch(`/api/notes/${noteId}`);
        const note = await noteResponse.json();
        if (note.recommendations && !showRecommendations) {
          setShowRecommendations(true);
          setShowDynamicallyAddedItemsLabel(true);
          setTimeout(() => {
            setShowDynamicallyAddedItemsLabel(false);
          }, 6000);
        }
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [note?._id, showRecommendations]);

  const updateNoteDetails = useCallback(async () => {
    setSaving(true);
    const noteResponse = await fetch(`/api/notes`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { _ID: note._id },
        document: {
          noteTemplate: template,
          markdownOutputOfTemplate: formatTemplateOutputToMarkdown(template),
        },
      }),
    });
    if (noteResponse.ok) {
      console.log("template saved to note");
    } else {
      console.error("failed to save template to note");
    }
    setSaving(false);
  }, [note._id, template]);

  const debouncedUpdateNoteTemplateState = useCallback(
    debounce(updateNoteDetails, 1000),
    []
  );

  const handleFormInputChange = useCallback(
    (templateItemIndex, formItemIndex) => {
      return (e) => {
        const augmentedTemplate = { ...template };
        augmentedTemplate.templateItems[templateItemIndex].form.formItems[
          formItemIndex
        ].value = e.target.value;
        setTemplate(augmentedTemplate);
        debouncedUpdateNoteTemplateState();
        console.log(augmentedTemplate);
      };
    },
    [debouncedUpdateNoteTemplateState, template]
  );

  // Todo centralize/deduplicate this (used on home page at the moment)
  const finalizeNote = useCallback(async () => {
    setLlmProcessing(true);
    const noteResponse = await fetch(`/api/notes`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { _ID: note._id },
        document: { state: "FINALIZED" },
      }),
    });
    setLlmProcessing(false);
    if (noteResponse.ok) {
      console.log("note finalized");
      setNoteBeingEdited(null);
    } else {
      console.error("failed to finalize note");
    }
    if (fetchNotes) {
      fetchNotes();
    }
  }, [note._id, fetchNotes, setNoteBeingEdited]);

  return (
    <Box
      sx={
        draggableVideoConsultAnchorRef?.current
          ? {
              position: "absolute",
              left: "98%",
              top: "0",
              width: "90%",
              pointerEvents: "all",
              maxHeight: "600px",
              zIndex: -1,
            }
          : { position: "relative", maxHeight: "80vh" }
      }
    >
      <Card
        key={note._id}
        sx={
          draggableVideoConsultAnchorRef?.current
            ? {
                pointerEvents: "all",
                maxHeight: "600px",
                overflowY: "scroll",
              }
            : { maxHeight: "80vh", overflowY: "auto" }
        }
      >
        <ConsultNoteCardHeader created={note.created} />
        <CardContent>
          <Stack spacing={0}>
            {/* metrics */}
            <NoteAreaExpanderHeading
              title="Metrics"
              handleClick={handleMetricsClick}
            />
            <Collapse in={expandedMetrics} timeout="auto" unmountOnExit>
              <Box sx={{ mb: 3, mt: 3 }}>
                <TemplateMetricPoint noteId={note._id}></TemplateMetricPoint>
              </Box>
            </Collapse>
            {template ? (
              template.templateItems.map((item, templateItemIndex) => {
                switch (item.key) {
                  case "custom":
                    return (
                      <div key={item.uuid}>
                        <NoteAreaExpanderHeading
                          title={item.form.formTitle}
                          handleClick={() =>
                            setExpandedCustomItems((prev) => {
                              return {
                                ...prev,
                                [item.uuid]: !prev[item.uuid],
                              };
                            })
                          }
                        />
                        {/* loops through the formItems and render titles, inputs, etc */}
                        <Collapse
                          in={expandedCustomItems?.[item.uuid]}
                          timeout="auto"
                          unmountOnExit
                          sx={{ pb: 2 }}
                        >
                          <Stack spacing={3} sx={{ pt: 3 }}>
                            {item.form.formItems?.map(
                              (formItem, formItemIndex) => {
                                switch (formItem.type) {
                                  case "input":
                                    return (
                                      <TextField
                                        key={formItem.id}
                                        label={formItem.name}
                                        variant="outlined"
                                        fullWidth
                                        onChange={handleFormInputChange(
                                          templateItemIndex,
                                          formItemIndex
                                        )}
                                        value={formItem?.value}
                                      />
                                    );
                                  case "textarea":
                                    return (
                                      <TextField
                                        key={formItem.id}
                                        label={formItem.name}
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        onChange={handleFormInputChange(
                                          templateItemIndex,
                                          formItemIndex
                                        )}
                                        value={formItem?.value}
                                      />
                                    );
                                  case "title":
                                    return (
                                      <div key={formItem.id}>
                                        <Typography variant="subtitle2">
                                          {formItem.title}
                                        </Typography>
                                        <Divider variant="middle" />
                                      </div>
                                    );
                                  case "select":
                                    return (
                                      <FormControl
                                        key={formItem.id}
                                        id={formItem.id}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                      >
                                        <Typography
                                          variant="body2"
                                          sx={{ mb: 1 }}
                                        >
                                          {formItem.title}
                                        </Typography>
                                        <Select
                                          labelId="demo-simple-select-outlined-label"
                                          id="demo-simple-select-outlined"
                                          value={formItem?.value || ""}
                                          onChange={handleFormInputChange(
                                            templateItemIndex,
                                            formItemIndex
                                          )}
                                        >
                                          {formItem.options.map((option) => (
                                            <MenuItem
                                              key={option.value}
                                              value={option.value}
                                              sx={{ zIndex: 3000 }}
                                            >
                                              {option.title}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    );
                                  default:
                                    return "";
                                }
                              }
                            )}
                          </Stack>
                        </Collapse>
                      </div>
                    );
                  default:
                    break;
                }
              })
            ) : (
              <>Loading Template...</>
            )}
            {/* teammate (vida ai) post consult recommendations */}
            {showRecommendations && (
              <Fade in={showRecommendations} timeout={3000}>
                <Box>
                  <NoteAreaExpanderHeading
                    title="Recommendations"
                    handleClick={handleRecommendationsClick}
                  />
                  <Collapse
                    in={expandedRecommendations}
                    timeout="auto"
                    unmountOnExit
                  >
                    <Box sx={{ mb: 3, mt: 3 }}>Recommended cards</Box>
                  </Collapse>
                </Box>
              </Fade>
            )}
            <Stack
              direction="row"
              spacing={2}
              sx={{ mt: 3, justifyContent: "flex-end" }}
            >
              <Button variant="" onClick={() => setNoteBeingEdited(null)}>
                Close
              </Button>
              {note.state !== "FINALIZED" && (
                <Button
                  variant="outlined"
                  onClick={finalizeNote}
                  sx={{ mt: 3 }}
                >
                  Finalize Note
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Fade in={saving} timeout={1000}>
        <SyncIcon
          sx={{
            position: "absolute",
            top: "25px",
            right: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 3001,
            color: "purple",
            animation: "spin 2s linear infinite",
            "@keyframes spin": {
              "0%": {
                transform: "rotate(360deg) scale(1)",
              },
              "50%": {
                transform: "rotate(180deg) scale(1.5)",
              },
              "100%": {
                transform: "rotate(0deg) scale(1)",
              },
            },
          }}
        />
      </Fade>
      <ThinkingEloquently show={llmProcessing} />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        sx={{
          position: "absolute",
          bottom: "-13px",
          right: "0",
          zIndex: 3001,
          height: "26px",
          pointerEvents: "none",
          width: "100%",
        }}
      >
        <Grid item xs={12}>
          <Slide
            in={showDynamicallyAddedItemsLabel}
            timeout={300}
            direction="up"
            mountOnEnter
            unmountOnExit
          >
            <Chip
              icon={<SyncIcon sx={{ fill: "#8d42c8" }} />}
              label="Note Items Dynamically Added"
              size="small"
              sx={{
                animation: "colorChange 2s linear infinite",
                "@keyframes colorChange": {
                  "0%": {
                    color: "#8d42c8",
                  },
                  "50%": {
                    color: "pupple",
                  },
                  "100%": {
                    color: "#8d42c8",
                  },
                },
              }}
            />
          </Slide>
        </Grid>
      </Grid>
    </Box>
  );
}
