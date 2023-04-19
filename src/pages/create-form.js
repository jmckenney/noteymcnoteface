import React, { useState } from "react";
import PageContainer from "@/components/PageContainer";
import PotentialFormItemDialog from "@/components/PotentialFormItemDialog";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  TextField,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";

import { useRouter } from "next/router";

const PotentialFormItem = ({ id, name }) => {
  return (
    <Button variant="outlined" startIcon={<ArrowBackIos />}>
      {name}
    </Button>
  );
};

const AddedFormItem = ({ id, name, type, title }) => {
  console.log("AddedFormItem", id, name, type, title);

  switch (type) {
    case "input":
      return (
        <Box key={id} sx={{ borderRadius: 1 }}>
          <FormControl fullWidth>
            <TextField
              id={name}
              label={name}
              onChange={(e) => {
                e.preventDefault();
                setTemplateTitle(e.target.value);
              }}
            />
          </FormControl>
        </Box>
      );
    case "textarea":
      return (
        <Box key={id} sx={{ p: 1, m: 1, borderRadius: 1 }}>
          <FormControl fullWidth>
            <InputLabel htmlFor={name}>{name}</InputLabel>
            <TextField
              multiline
              rows={4}
              id={name}
              placeholder={name}
              onChange={(e) => {
                e.preventDefault();
                setTemplateTitle(e.target.value);
              }}
            />
          </FormControl>
        </Box>
      );
    case "title":
      return (
        <Box key={id} sx={{ p: 1, m: 1, borderRadius: 1 }}>
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
        </Box>
      );

    default:
      break;
  }
};

export default function TemplateCreationPage() {
  const [addedFormItems, setAddedFormItems] = useState([]);
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [showInputFormItemDialog, setShowInputFormItemDialog] = useState(false);
  const [inputFormItemDialogType, setInputFormItemDialogType] =
    useState(undefined);
  const router = useRouter();

  const [potentialFormItems, setPotentialFormItems] = useState([
    { name: "Input", key: "input" },
    { name: "TextArea", key: "textarea" },
    { name: "Title", key: "title" },
  ]);

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

    if (response.ok) {
      console.log("Form saved successfully!");
      // redirect to forms page
      router.push("/forms");
    } else {
      console.error("Failed to save form");
    }
  };
  return (
    <>
      <PageContainer title="Create form">
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
            <Box sx={{ mt: 4 }}>
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
            </Box>

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
              Save Template
            </Button>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ flexGrow: 2, pl: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Potential Form Items
            </Typography>
            <Stack spacing={2} sx={{ textAlign: "left" }}>
              {potentialFormItems.map((formItem) => (
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
      </PageContainer>
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
