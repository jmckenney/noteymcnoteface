import React, { useState, useEffect } from "react";
import PageContainer from "../components/PageContainer";
import Link from "next/link";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";

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
    <PageContainer title="Forms">
      <List dense>
        {forms?.map((form) => (
          <ListItem key="form.formTitle">
            <ListItemButton component="a" href={`/form/${form._id}`}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={form.formTitle} secondary={form._id} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </PageContainer>
  );
}
