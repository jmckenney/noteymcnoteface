import React, { useContext, useCallback, useState } from "react";
import {
  Button,
  Box,
  Card,
  Stack,
  Typography,
  TextField,
  CardContent,
  Collapse,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import TemplateMetricPoint from "../template-parts/TemplateMetricPoint";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";
import { formatTemplateOutputToMarkdown } from "@/components/templates/formatTemplateOutputToMarkdown";
import SyncIcon from "@mui/icons-material/Sync";
import Fade from "@mui/material/Fade";
import ConsultNoteCardHeader from "./ConsultNoteCardHeader";
import CoolGraph from "../CoolGraph/CoolGraph.js";
import NoteAreaExpanderHeading from "./NoteAreaExpanderHeading";
import ThinkingEloquently from "../animations/ThinkingEloquently";
import NoteContext from "@/hooks/TeamContext";

export default function ConsultNoteEditor({
  note,
  draggableVideoConsultAnchorRef,
}) {
  const [expandedMemberSummary, setExpandedMemberSummary] =
    React.useState(false);
  const [expandedMetrics, setExpandedMetrics] = React.useState(false);
  const [template, setTemplate] = useState(note.noteTemplate);
  const [saving, setSaving] = useState(false);
  const [llmProcessing, setLlmProcessing] = useState(false);
  const [expandedCustomItems, setExpandedCustomItems] = useState({});
  const router = useRouter();
  const { setNoteBeingEdited } = useContext(NoteContext);

  const handleExpandMemberSummary = useCallback(() => {
    setExpandedMemberSummary(!expandedMemberSummary);
  }, [expandedMemberSummary]);

  const handleMetricsClick = useCallback(() => {
    setExpandedMetrics(!expandedMetrics);
  }, [expandedMetrics]);

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
  }, [note._id, router]);

  return (
    <>
      <Card
        key={note._id}
        sx={
          draggableVideoConsultAnchorRef?.current
            ? {
                position: "absolute",
                left: "98%",
                top: "0",
                width: "90%",
                pointerEvents: "all",
                maxHeight: "600px",
                overflowY: "scroll",
                zIndex: -1,
              }
            : { position: "relative", maxHeight: "80vh", overflowY: "auto" }
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
                      <>
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
                                      <>
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
                                      </>
                                    );
                                  case "title":
                                    return (
                                      <>
                                        <Typography
                                          variant="subtitle"
                                          key={formItem.uuid}
                                        >
                                          {formItem.title}
                                        </Typography>
                                        <Divider variant="middle" />
                                      </>
                                    );
                                  case "select":
                                    return (
                                      <>
                                        <FormControl
                                          fullWidth
                                          variant="outlined"
                                        >
                                          <InputLabel id="demo-simple-select-outlined-label">
                                            {formItem.title}
                                          </InputLabel>
                                          <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={formItem?.value}
                                            onChange={handleFormInputChange(
                                              templateItemIndex,
                                              formItemIndex
                                            )}
                                            label={formItem.title}
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
                                      </>
                                    );
                                  default:
                                    return <></>;
                                }
                              }
                            )}
                          </Stack>
                        </Collapse>
                      </>
                    );
                  default:
                    break;
                }
              })
            ) : (
              <>Loading Template...</>
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
        <Fade in={saving} timeout={1000}>
          <SyncIcon
            sx={{
              position: "fixed",
              top: "25px",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1000,
              color: "purple",
              animation: "spin 2s linear infinite",
              "@keyframes spin": {
                "0%": {
                  transform: "rotate(360deg)",
                },
                "100%": {
                  transform: "rotate(0deg)",
                },
              },
            }}
          />
        </Fade>
        <ThinkingEloquently show={llmProcessing} />
      </Card>
    </>
  );
}
