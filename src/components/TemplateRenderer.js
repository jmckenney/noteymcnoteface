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

      // Maybe this should be "note" renderer?
      // but then what about those ephemeral expanders that are only for outputting text?
      // likely we will want to share some of this logic (the template item renderers)
      // but we'll end up having a component that takes the template json and one that
      // is a higher order component that gets the json from either the note or the template
      // from the db.
      const response = await fetch(`/api/templates/643dbafd838bdd512908e06c`);
      const template = await response.json();
      const note = {
        noteType: "CONSULT_ENCOUNTER",
        noteTemplate: template,
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
      setTemplate(template);
    };
    if (typeof window !== "undefined") {
      fetchTemplate();
    }
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
                      Custom Form... Render it, set its details, handle it, save
                      for next render? Or render as part of form?
                    </Typography>
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
