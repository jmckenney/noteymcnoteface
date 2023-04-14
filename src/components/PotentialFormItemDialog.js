import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { v4 as uuidv4 } from "uuid";

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

  const formPotentialItemTypeSpecifier = () => {
    switch (type) {
      case "input":
      case "textarea":
        return (
          <>
            <label
              className="block text-gray-700 text-sm  mb-2"
              htmlFor="inputName"
            >
              Input Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="inputName"
              type="text"
              placeholder="Input Name"
              onChange={(e) => {
                e.preventDefault();
                setInputName(e.target.value);
              }}
              value={inputName}
            />
          </>
        );
      case "title":
        return (
          <>
            <label
              className="block text-gray-700 text-sm  mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              onChange={(e) => {
                e.preventDefault();
                setTitle(e.target.value);
              }}
              value={title}
            />
          </>
        );
      default:
        return "Input";
    }
  };

  return (
    <Dialog open onClose={handleClose}>
      <DialogTitle>{heading}</DialogTitle>
      <DialogContent>{formPotentialItemTypeSpecifier()}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSaveClick}>Add Form Item</Button>
      </DialogActions>
    </Dialog>
  );
}
