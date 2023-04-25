import React, { useState } from "react";
import {
  Avatar,
  Button,
  Box,
  Card,
  CardHeader,
  Stack,
  Typography,
  TextField,
  CardActionArea,
  CardContent,
  Chip,
  Collapse,
  Divider,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import TemplateMetricPoint from "./template-parts/TemplateMetricPoint";
import debounce from "lodash/debounce";
import { styled } from "@mui/material/styles";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/router";

import CoolGraph from "./CoolGraph/CoolGraph.js";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const updateNoteTemplateState = async (noteId, augmentedTemplate) => {
  // patch the template part of the note
  const noteResponse = await fetch(`/api/notes`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: { _ID: noteId },
      document: { noteTemplate: augmentedTemplate },
    }),
  });
  if (noteResponse.ok) {
    console.log("template saved to note");
  } else {
    console.error("failed to save template to note");
  }
};

const debouncedUpdateNoteTemplateState = debounce(
  updateNoteTemplateState,
  1000
);

export default function ConsultNote({ note }) {
  const [mode, setMode] = useState("view");
  const [expanded, setExpanded] = React.useState(false);
  const [template, setTemplate] = useState(note.noteTemplate);
  const router = useRouter();

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleFormInputChange = (templateItemIndex, formItemIndex) => {
    return (e) => {
      const augmentedTemplate = { ...template };
      augmentedTemplate.templateItems[templateItemIndex].form.formItems[
        formItemIndex
      ].value = e.target.value;
      setTemplate(augmentedTemplate);
      debouncedUpdateNoteTemplateState(note._id, augmentedTemplate);
      console.log(augmentedTemplate);
    };
  };

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
    <Card key={note._id}>
      {mode === "view" ? (
        <CardActionArea onClick={() => setMode("edit")}>
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
            <Typography variant="body">
              {note.summary ? note.summary : "Summary being created..."}
            </Typography>
          </CardContent>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>More Info:</Typography>
              <Typography paragraph>
                lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in
              </Typography>
            </CardContent>
          </Collapse>
        </CardActionArea>
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
                  onClick={handleExpandClick}
                >
                  Member Summary
                  <ExpandMoreIcon
                    sx={{ transform: expanded ? "rotate(180deg)" : "none" }}
                  />
                </Typography>
              </Box>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
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
