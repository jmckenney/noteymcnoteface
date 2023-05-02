import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";

export default function TemplatesPage() {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await fetch("/api/forms");
      const forms = await response.json();
      console.log("forms", forms);
      setForms(forms);
    };
    fetchTemplates();
  }, []);

  return (
    <>
      <List dense>
        {forms?.map((form) => (
          <ListItem key="form.formTitle">
            <ListItemButton component="a" href={`/form/${form._id}`}>
              <ListItemIcon>
                <ChecklistIcon />
              </ListItemIcon>
              <ListItemText primary={form.formTitle} secondary={form._id} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
}
