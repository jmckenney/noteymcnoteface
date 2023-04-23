import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Card,
  CardHeader,
  Stack,
  Typography,
  TextField,
  FormControl,
  InputLabel,
} from "@mui/material";
import TemplateMetricPoint from "./template-parts/TemplateMetricPoint";
import debounce from "lodash/debounce";

// ToDo Extract this into an api area
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
  10000
);

export default function Note() {
  const [template, setTemplate] = useState(null);
  const [noteId, setNoteId] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      // hard coding template id for now for .hcinitial
      const response = await fetch(`/api/templates/643dbafd838bdd512908e06c`);
      const templateJson = await response.json();

      // Get all the subforms for this template and augment the template with them.
      // loop through all templatesItems that have key of custom and fetch their form json
      await Promise.all(
        templateJson.templateItems
          .filter((item) => item.key === "custom")
          .map(async (item) => {
            const response = await fetch(`/api/forms/${item.formUuid}`);
            const form = await response.json();
            // augment the form with the uuid of the template item
            // TODO, make this more explicit. This is only working because filter and map are passing
            // the original items by reference, not by value.
            item.form = form;
            return form;
          })
      );

      // if this is a note and we have the template fully loaded,
      // save that template, including the subform tree, to the note (for current and future editing)
      // TODO add the if condition here or enhance to make this obvious it only happens with editable notes.
      const note = {
        noteType: "CONSULT_ENCOUNTER",
        noteTemplate: templateJson,
        providerUuid: "asldkjfldk-lkdjfjlkd-ldfkd", // mocked, obvi.
        memberUuid: "bsldkjfldk-lkdjfjlkd-ldfkz", // mocked, obvi.
        state: "IN_PROGRESS", // finalized will come later...
        metrics: [],
      };
      const noteResponse = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ document: note }),
      });
      const noteResponseJson = await noteResponse.json();
      setNoteId(noteResponseJson.insertedId);
      setTemplate(templateJson);
    };
    fetchTemplate();
  }, []);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  //   useEffect(() => {
  //     const fetchNotes = async () => {
  //       const response = await fetch(`/api/notes?state=${state}&limit=10`);
  //       const notesJson = await response.json();
  //       setNotes(notesJson);
  //     };
  //     fetchNotes();
  //   }, [state]);

  const handleFormInputChange = (templateItemIndex, formItemIndex) => {
    return (e) => {
      const augmentedTemplate = { ...template };
      augmentedTemplate.templateItems[templateItemIndex].form.formItems[
        formItemIndex
      ].value = e.target.value;
      setTemplate(augmentedTemplate);
      debouncedUpdateNoteTemplateState(noteId, augmentedTemplate);
      console.log(augmentedTemplate);
    };
  };

  return (
    <Stack spacing={3}>
      {notes.length ? (
        notes.map((note) => {
          switch (note.noteType) {
            case "CONSULT_ENCOUNTER":
              return (
                <Card key={note._id}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: red[500] }}>LS</Avatar>}
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title="Consult Note"
                    subheader={
                      note.created
                        ? formatter.format(new Date(note.created))
                        : ""
                    }
                  />
                  <CardContent>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label="High Risk Language"
                        color="error"
                        size="small"
                      />
                      <Chip
                        label="New Medications"
                        color="success"
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body">
                      In the health coaching follow-up session, the member
                      discussed their struggles in reaching 10,000 steps daily
                      and considered ways to make physical activity more
                      enjoyable. The wellness plan includes goals such as
                      limiting fast food, achieving daily step targets, and
                      exploring various activities to increase movement.
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <ExpandMore
                      expand={expanded}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography paragraph>More Info:</Typography>
                      <Typography paragraph>
                        lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                      </Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              );
              break;

            default:
              break;
          }
        })
      ) : (
        <>Loading Template...</>
      )}
    </Stack>
  );
}
