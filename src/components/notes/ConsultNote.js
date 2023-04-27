import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Box,
  Card,
  CardHeader,
  Grid,
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
import SyncIcon from "@mui/icons-material/Sync";
import Fade from "@mui/material/Fade";
import Lottie from "lottie-web";
import AiProcessing from "@/components/animations/ai.json";

import CoolGraph from "../CoolGraph/CoolGraph.js";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NoteAreaExpanderHeading from "./NoteAreaExpanderHeading";

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
  const [expandedMetrics, setExpandedMetrics] = React.useState(false);
  const [template, setTemplate] = useState(note.noteTemplate);
  const [saving, setSaving] = useState(false);
  const [llmProcessing, setLlmProcessing] = useState(false);
  const [expandedCustomItems, setExpandedCustomItems] = useState({});
  const router = useRouter();
  const lottieRef = React.useRef();

  useEffect(() => {
    Lottie.loadAnimation({
      container: lottieRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: AiProcessing,
    });

    return () => {
      Lottie.destroy();
    };
  }, []);

  const handleExpandMemberAiSummary = () => {
    setExpandedMemberSummary(!expandedMemberSummary);
  };

  const handleMetricsClick = () => {
    setExpandedMetrics(!expandedMetrics);
  };

  const handleExpandFullNoteSummary = () => {
    setExpandedFullNote(!expandedFullNote);
  };

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
      debouncedUpdateNoteTemplateState();
      console.log(augmentedTemplate);
    };
  };

  // Todo centralize/deduplicate this (used on home page at the moment)
  const finalizeNote = async () => {
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
      // refresh page (or refresh notes)
      router.reload(window.location.pathname);
    } else {
      console.error("failed to finalize note");
    }
  };

  return (
    <>
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
                    onClick={handleExpandFullNoteSummary}
                    sx={{ cursor: "pointer" }}
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
              <Stack spacing={0}>
                {/* member summary */}
                <NoteAreaExpanderHeading
                  title="Member Summary"
                  handleClick={handleExpandMemberAiSummary}
                />
                <Collapse
                  in={expandedMemberSummary}
                  timeout="auto"
                  unmountOnExit
                >
                  <Stack spacing={3} sx={{ mt: 3, mb: 3 }}>
                    <Box>
                      <CoolGraph />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1">Past Consults</Typography>
                      <p>2 with me</p>
                    </Box>
                  </Stack>
                </Collapse>
                {/* metrics */}
                <NoteAreaExpanderHeading
                  title="Metrics"
                  handleClick={handleMetricsClick}
                />
                <Collapse in={expandedMetrics} timeout="auto" unmountOnExit>
                  <Box sx={{ mb: 3, mt: 3 }}>
                    <TemplateMetricPoint
                      noteId={note._id}
                    ></TemplateMetricPoint>
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
            </CardContent>
          </>
        )}
      </Card>
      <Fade in={saving} timeout={1000}>
        <SyncIcon
          sx={{
            position: "fixed",
            top: "50%",
            right: "50%",
            transform: "translate(50%, -50%)",
            zIndex: 1000,
            color: "green",
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
      <Fade in={llmProcessing} timeout={1000}>
        <Box
          ref={lottieRef}
          sx={{
            position: "fixed",
            top: "50%",
            right: "50%",
            transform: "translate(50%, -50%)",
            zIndex: 1000,
            width: "200px",
            height: "200px",
          }}
        />
      </Fade>
    </>
  );
}
