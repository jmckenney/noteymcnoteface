import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Card,
  CardHeader,
  Stack,
  Typography,
  TextField,
} from "@mui/material";
import TemplateMetricPoint from "./template-parts/TemplateMetricPoint";
import { v4 as uuidv4 } from "uuid";

export default function TemplateRenderer({ trigger = ".hcinitial" }) {
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

  return (
    <Card>
      <CardHeader
        title="Initial Health Coaching Consult Note"
        subheader="Details for your first consult with Tristen."
      />
      <Stack
        sx={{
          px: 3,
          py: 3,
        }}
        spacing={3}
      >
        {template ? (
          template.templateItems.map((item) => {
            switch (item.key) {
              case "sessionNumber":
                return (
                  <Box key={item.uuid}>
                    <Typography variant="subtitle1">Past Consults</Typography>
                    <p>2 with me</p>
                  </Box>
                );
              case "metricPointWeight":
                return (
                  <TemplateMetricPoint
                    key={item.uuid}
                    noteId={noteId}
                  ></TemplateMetricPoint>
                );
              case "custom":
                return (
                  <Stack spacing={1} key={item.uuid}>
                    <Typography variant="subtitle1">
                      {item.form.formTitle}
                    </Typography>
                    {/* loops through the formItems and render titles, inputs, etc */}
                    {item.form.formItems.map((formItem) => {
                      switch (formItem.type) {
                        case "input":
                          return (
                            <TextField
                              key={formItem.uuid}
                              label={formItem.label}
                              variant="outlined"
                              fullWidth
                            />
                          );
                        case "textarea":
                          return (
                            <TextField
                              key={formItem.uuid}
                              label={formItem.label}
                              variant="outlined"
                              fullWidth
                              multiline
                              rows={4}
                            />
                          );
                        case "title":
                          return (
                            <Typography variant="subtitle" key={formItem.uuid}>
                              {formItem.title}
                            </Typography>
                          );
                        default:
                          return <></>;
                      }
                    })}
                  </Stack>
                );
              default:
                break;
            }
          })
        ) : (
          <>Loading Template...</>
        )}
      </Stack>
    </Card>
  );
}
