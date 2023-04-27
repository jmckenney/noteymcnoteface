import React, { useState } from "react";
import PotentialFormItemDialog from "@/components/PotentialFormItemDialog";
import { potentialFormItems } from "@/components/forms/potentialFormItems";
import { PotentialFormItem } from "@/components/forms/PotentialFormItem";

import {
  Box,
  Button,
  Divider,
  FormControl,
  TextField,
  Stack,
  Typography,
} from "@mui/material";

import AddedFormItem from "@/components/forms/AddedFormItem";

export default function CreateForm({ handleSavedForm }) {
  const [addedFormItems, setAddedFormItems] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [showInputFormItemDialog, setShowInputFormItemDialog] = useState(false);
  const [inputFormItemDialogType, setInputFormItemDialogType] =
    useState(undefined);

  const [potentialFormItemsList, setPotentialFormItemsList] =
    useState(potentialFormItems);

  const handleAdd = (key) => {
    setInputFormItemDialogType(key);
    setShowInputFormItemDialog(true);
  };

  const saveForm = async () => {
    if (addedFormItems.length === 0) return;
    const form = {
      formTitle,
      formDescription,
      formItems: addedFormItems,
    };
    console.log("save form", form);
    const response = await fetch("/api/forms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ document: form }),
    });
    const responseJson = await response.json();

    if (response.ok) {
      console.log("Form saved successfully!");
      // set created form id
      // redirect to forms page
      console.log("responseJson", responseJson);
      handleSavedForm(responseJson.insertedId);
    } else {
      console.error("Failed to save form");
    }
  };
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 3, pr: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Form Details
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <TextField
              id="formTitle"
              type="text"
              label="Form Title"
              onChange={(e) => {
                e.preventDefault();
                setFormTitle(e.target.value);
              }}
              value={formTitle}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <TextField
              label="Form Description"
              multiline
              rows={4}
              id="formDescription"
              onChange={(e) => {
                e.preventDefault();
                setFormDescription(e.target.value);
              }}
              value={formDescription}
            />
          </FormControl>
          <Typography variant="h6" component="h2" gutterBottom>
            Added Form Items
          </Typography>
          <Stack sx={{ mt: 4 }} spacing={2}>
            {addedFormItems.map((formItem, index) => (
              <AddedFormItem
                key={formItem.id}
                id={formItem.id}
                name={formItem.name}
                type={formItem.type}
                index={index}
                title={formItem.title}
              />
            ))}
          </Stack>

          {addedFormItems.length === 0 && (
            <p>
              <em>Add at least one item from the right.</em>
            </p>
          )}
          <Button
            onClick={saveForm}
            variant="outlined"
            sx={{ mt: 2 }}
            disabled={addedFormItems.length === 0}
          >
            Save Form
          </Button>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box sx={{ flexGrow: 2, pl: 4 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Potential Form Items
          </Typography>
          <Stack spacing={2} sx={{ textAlign: "left" }}>
            {potentialFormItemsList.map((formItem) => (
              <div
                key={`div${formItem.id}`}
                onClick={() => handleAdd(formItem.key)}
              >
                <PotentialFormItem
                  key={formItem.id}
                  id={formItem.id}
                  name={formItem.name}
                />
              </div>
            ))}
          </Stack>
        </Box>
      </Box>
      {showInputFormItemDialog && (
        <PotentialFormItemDialog
          setOpen={setShowInputFormItemDialog}
          saveFormItem={(formItem) => {
            setAddedFormItems([...addedFormItems, formItem]);
          }}
          heading={`Add ${inputFormItemDialogType} Item`}
          type={inputFormItemDialogType}
        ></PotentialFormItemDialog>
      )}
    </>
  );
}
