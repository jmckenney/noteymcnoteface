import React from "react";
import {
  Box,
  FormControl,
  TextField,
  Typography,
  InputLabel,
} from "@mui/material";

const AddedFormItem = ({ id, name, type, title }) => {
  const formItemTypes = {
    input: () => (
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
    ),
    textarea: () => (
      <Box key={id} sx={{ borderRadius: 1 }}>
        <FormControl fullWidth>
          <TextField
            multiline
            label={name}
            rows={4}
            id={name}
            onChange={(e) => {
              e.preventDefault();
              setTemplateTitle(e.target.value);
            }}
          />
        </FormControl>
      </Box>
    ),
    title: () => (
      <Box key={id} sx={{ p: 1, m: 1, borderRadius: 1 }}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
      </Box>
    ),
  };

  const FormItem = formItemTypes[type];

  return FormItem ? FormItem() : null;
};

export default AddedFormItem;
