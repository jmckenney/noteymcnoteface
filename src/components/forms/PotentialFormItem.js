import React from "react";
import { Button } from "@mui/material";
import { ArrowBackIos } from "@mui/icons-material";

export const PotentialFormItem = ({ id, name }) => {
  return (
    <Button variant="outlined" startIcon={<ArrowBackIos />}>
      {name}
    </Button>
  );
};
