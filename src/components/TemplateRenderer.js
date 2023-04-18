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
import { v4 as uuidv4 } from "uuid";

export default function TemplateRenderer({ trigger = ".hcinitial" }) {
  const [template, setTemplate] = useState(null);
  const [noteId, setNoteId] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      // hard coding template id for now for .hcinitial
      const response = await fetch(`/api/templates/643dbafd838bdd512908e06c`);
      const template = await response.json();
      console.log("template", template);
      // save a note with the type, store the id of the saved note
      const note = {
        noteType: "CONSULT_ENCOUNTER",
        noteTemplate: template,
        providerUuid: "asldkjfldk-lkdjfjlkd-ldfkd", // mocked, obvi.
        memberUuid: "bsldkjfldk-lkdjfjlkd-ldfkz", // mocked, obvi.
      };
      // const noteResponse = await fetch("/api/notes", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ document: note }),
      // });
      // console.log("noteResponse", noteResponse);
      // setNoteId(noteResponse._id);
      setTemplate(template);
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
                  <Box>
                    <Typography variant="subtitle1">Past Consults</Typography>
                    <p>None</p>
                  </Box>
                );
              case "metricPointWeight":
                return (
                  <Stack spacing={1}>
                    <Typography variant="subtitle1">
                      New Weight Entry
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <TextField
                        type="text"
                        label="Weight"
                        placeholder="enter weight in lbs."
                      />
                      <Button variant="outlined">Save Weight To Metrics</Button>
                    </Stack>
                  </Stack>
                );
              case "custom":
                return (
                  <Stack spacing={1}>
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
          <>loading template</>
        )}
      </Stack>
    </Card>
  );
}
