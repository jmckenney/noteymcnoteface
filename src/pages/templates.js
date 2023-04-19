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
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await fetch("/api/templates");
      const templates = await response.json();
      setTemplates(templates);
    };
    fetchTemplates();
  }, []);

  return (
    <PageContainer title="Templates">
      <List dense>
        {templates?.map((template) => (
          <ListItem key="form.formTitle">
            <ListItemButton component="a" href={`/template/${template._id}`}>
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText
                primary={template.templateTitle}
                secondary={template.templateTrigger}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </PageContainer>
  );
}
