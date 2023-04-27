import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Box,
  Card,
  CardHeader,
  Stack,
  Typography,
  TextField,
  CardContent,
  Chip,
  Collapse,
  Divider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TemplateMetricPoint from "../template-parts/TemplateMetricPoint";
import debounce from "lodash/debounce";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/router";
import Markdown from "@/components/Markdown";
import { formatTemplateOutputToMarkdown } from "@/components/templates/formatTemplateOutputToMarkdown";

import CoolGraph from "../CoolGraph/CoolGraph.js";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function ConsultNote({ note }) {
  const [mode, setMode] = useState("view");
  const [expandedFullNote, setExpandedFullNote] = React.useState(false);
  const [expandedMemberSummary, setExpandedMemberSummary] =
    React.useState(false);
  const [template, setTemplate] = useState(note.noteTemplate);
  const router = useRouter();

  const handleExpandMemberSummaryClick = () => {
    setExpandedMemberSummary(!expandedMemberSummary);
  };

  const handleExpandFullNote = () => {
    setExpandedFullNote(!expandedFullNote);
  };

  const updateNoteDetails = useCallback(async () => {
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
  }, []);

  const debouncedUpdateNoteTemplateState = useCallback(
    debounce(updateNoteDetails, 1000),
    []
  );

  const handleFormInputChange = (templateItemIndex, formItemIndex) => {
    return (e) => {
      const augmentedTemplate = { ...template };
      augmentedTemplate.templateItems[templateItemIndex].form.formItems[
        formItemIndex
      ].value = e.target.value;
      setTemplate(augmentedTemplate);
      // debouncedUpdateNoteTemplateState(note._id, augmentedTemplate);
      console.log(augmentedTemplate);
    };
  };

  useEffect(() => {
    debouncedUpdateNoteTemplateState();
  }, [template, debouncedUpdateNoteTemplateState]);

  // Todo centralize/deduplicate this (used on home page at the moment)
  const finalizeNote = async () => {
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
    if (noteResponse.ok) {
      console.log("note finalized");
      // refresh page (or refresh notes)
      router.reload(window.location.pathname);
    } else {
      console.error("failed to finalize note");
    }
  };

  return (
    <Card key={note._id} onDoubleClick={() => setMode("edit")}>
      {mode === "view" ? (
        <>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: "#8D42C8" }}>LS</Avatar>}
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title="Consult Note"
            subheader={
              note.created ? formatter.format(new Date(note.created)) : ""
            }
          />

          <CardContent>
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip
                label="High Risk Language"
                color="error"
                sx={{
                  bgcolor: "#FAE6F4",
                  color: "#972782",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  px: 1,
                }}
                size="small"
              />
              <Chip
                label="New Medications"
                color="success"
                sx={{
                  bgcolor: "#F1DFFF",
                  color: "#712DA7",
                  fontWeight: "bold",
                  borderRadius: "5px",
                  px: 1,
                }}
                size="small"
              />
            </Stack>
            <Stack spacing={2}>
              <Typography variant="body">
                {note.summary ? (
                  <>
                    <strong>AI Summary:</strong> {note.summary}
                  </>
                ) : (
                  "Summary being created..."
                )}
              </Typography>
              <Box>
                <Typography
                  variant="subtitle1"
                  display="flex"
                  onClick={handleExpandFullNote}
                >
                  See Full Note
                  <ExpandMoreIcon
                    sx={{
                      transform: expandedFullNote ? "rotate(180deg)" : "none",
                    }}
                  />
                </Typography>
              </Box>
            </Stack>
          </CardContent>
          <Collapse in={expandedFullNote} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>More Info:</Typography>
              <Typography paragraph>
                <Markdown>
                  {note.markdownOutputOfTemplate ||
                    "Full note being created..."}
                </Markdown>
              </Typography>
            </CardContent>
          </Collapse>
          {/* </CardActionArea> */}
        </>
      ) : (
        <>
          <CardHeader
            avatar={<Avatar sx={{ bgcolor: "#8D42C8" }}>LS</Avatar>}
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title="Consult Note"
            subheader={
              note.created ? formatter.format(new Date(note.created)) : ""
            }
          />
          <CardContent>
            <Stack spacing={3}>
              {/* summary */}
              <Box>
                <Typography
                  variant="subtitle1"
                  display="flex"
                  onClick={handleExpandMemberSummaryClick}
                >
                  Member Summary
                  <ExpandMoreIcon
                    sx={{
                      transform: expandedMemberSummary
                        ? "rotate(180deg)"
                        : "none",
                    }}
                  />
                </Typography>
              </Box>
              <Collapse in={expandedMemberSummary} timeout="auto" unmountOnExit>
                <Box>
                  <CoolGraph />
                </Box>
              </Collapse>
              {template ? (
                template.templateItems.map((item, templateItemIndex) => {
                  switch (item.key) {
                    case "sessionNumber":
                      return (
                        <Box key={item.uuid}>
                          <Typography variant="subtitle1">
                            Past Consults
                          </Typography>
                          <p>2 with me</p>
                        </Box>
                      );
                    case "metricPointWeight":
                      return (
                        <TemplateMetricPoint
                          key={item.uuid}
                          noteId={note._id}
                        ></TemplateMetricPoint>
                      );
                    case "custom":
                      return (
                        <Stack spacing={2} key={item.uuid}>
                          <Typography variant="subtitle1">
                            {item.form.formTitle}
                          </Typography>
                          {/* loops through the formItems and render titles, inputs, etc */}
                          {item.form.formItems.map(
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
                                default:
                                  return <></>;
                              }
                            }
                          )}
                        </Stack>
                      );
                    default:
                      break;
                  }
                })
              ) : (
                <>Loading Template...</>
              )}
              {note.state !== "FINALIZED" && (
                <Button variant="outlined" onClick={finalizeNote}>
                  Finalize Note
                </Button>
              )}
            </Stack>
          </CardContent>
        </>
      )}
    </Card>
  );
}
