import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Card,
  CardHeader,
  Stack,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
import TemplateMetricPoint from "./template-parts/TemplateMetricPoint";
import debounce from "lodash/debounce";
import { useRouter } from "next/router";

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

export default function TemplateRenderer({ trigger = ".hcinitial" }) {
  const [template, setTemplate] = useState(null);
  const [noteId, setNoteId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplate = async () => {
      // hard coding template id for now for .hcinitial
      const response = await fetch(`/api/templates/644b06bbdcbd9f2e0b11e5f6`);
      const templateJson = await response.json();

      // Get all the subforms for this template and augment the template with them.
      // loop through all templatesItems that have key of custom and fetch their form json
      await Promise.all(
        templateJson.templateItems
          .filter((item) => item.key === "custom")
          .map(async (item) => {
            const response = await fetch(`/api/forms/${item.formDbId}`);
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

  // Todo centralize/deduplicate this (used on home page at the moment)
  const finalizeNote = async () => {
    const noteResponse = await fetch(`/api/notes`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { _ID: noteId },
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
          <>
            {template.templateItems.map((item, templateItemIndex) => {
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
                    <Stack spacing={2} key={item.uuid}>
                      <Typography variant="subtitle1">
                        {item.form.formTitle}
                      </Typography>
                      {/* loops through the formItems and render titles, inputs, etc */}
                      {item.form.formItems.map((formItem, formItemIndex) => {
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
                      })}
                    </Stack>
                  );
                default:
                  break;
              }
            })}

            <Button variant="outlined" onClick={finalizeNote}>
              Finalize Note
            </Button>
          </>
        ) : (
          <>Loading Template...</>
        )}
      </Stack>
    </Card>
  );
}
