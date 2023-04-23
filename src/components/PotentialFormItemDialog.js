import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { v4 as uuidv4 } from "uuid";

import { TextField, FormControl, InputLabel, FormGroup } from "@mui/material";

export default function PotentialFormItemDialog({
  setOpen,
  saveFormItem,
  heading,
  type,
}) {
  const [inputName, setInputName] = useState("");
  const [title, setTitle] = useState("");
  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveClick = () => {
    switch (type) {
      case "input":
        saveFormItem({ id: uuidv4(), name: inputName, type: "input" });
        break;
      case "textarea":
        saveFormItem({ id: uuidv4(), name: inputName, type: "textarea" });
        break;
      case "title":
        saveFormItem({ id: uuidv4(), title, type: "title" });
        break;

      default:
        break;
    }
    setOpen(false);
  };

  const FormPotentialItemTypeSpecifier = () => {
    const handleChange = (setter) => (event) => {
      event.preventDefault();
      setter(event.target.value);
    };

    switch (type) {
      case "input":
      case "textarea":
        return (
          <FormGroup>
            <FormControl>
              <TextField
                id="inputName"
                label="Input Name"
                type="text"
                placeholder="Input Name"
                onChange={handleChange(setInputName)}
                value={inputName}
                variant="outlined"
                fullWidth
                sx={{ mt: 1 }}
              />
            </FormControl>
          </FormGroup>
        );
      case "title":
        return (
          <FormGroup>
            <FormControl>
              <TextField
                id="title"
                type="text"
                onChange={handleChange(setTitle)}
                value={title}
                variant="outlined"
                fullWidth
                label="Title Text"
                sx={{ mt: 1 }}
              />
            </FormControl>
          </FormGroup>
        );
      default:
        return "Input";
    }
  };

  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>{heading}</DialogTitle>
      <DialogContent>{FormPotentialItemTypeSpecifier()}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSaveClick}>Add Form Item</Button>
      </DialogActions>
    </Dialog>
  );
}
