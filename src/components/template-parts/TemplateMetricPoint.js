// simple react functional component
import React, { useState } from "react";
import { Box, Button, Stack, Typography, TextField } from "@mui/material";

export default function TemplateMetricPoint({ noteId }) {
  const [weight, setWeight] = useState(0);
  const handleSave = async () => {
    // save weight to metrics
    console.log("saving");
    const response = await fetch("/api/metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ document: { weight, noteId } }),
    });
    if (response.ok) {
      console.log("weight saved to metrics");
    } else {
      console.error("failed to save weight to metrics");
    }
    /**
     * Associate the metric with the note. Put/Patch the note
     * by adding to the metrics array.
     */
    const noteResponse = await fetch(`/api/notes`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { _ID: noteId },
        document: { metrics: { weight: weight, unit: "lbs" } },
      }),
    });
    if (noteResponse.ok) {
      console.log("weight saved to note");
    } else {
      console.error("failed to save weight to note");
    }
  };
  return (
    <Stack spacing={1}>
      <Typography variant="subtitle1">New Weight Entry</Typography>
      <Stack direction="row" spacing={1}>
        <svg
          class="MuiSvgIcon-root MuiSvgIcon-colorError MuiSvgIcon-fontSizeMedium css-1nkrb4e-MuiSvgIcon-root"
          focusable="false"
          viewBox="0 0 24 24"
          aria-hidden="true"
          data-testid="TrendingDownIcon"
          width="25"
          fill="#12B76A"
        >
          <path d="m16 18 2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z"></path>
        </svg>{" "}
        <Box>-11 lbs</Box>
      </Stack>

      <Stack direction="row" spacing={2}>
        <TextField
          type="text"
          label="Weight"
          placeholder="enter weight in lbs."
          onChange={(e) => setWeight(e.target.value)}
        />
        <Button variant="outlined" onClick={handleSave}>
          Save Weight To Metrics
        </Button>
      </Stack>
    </Stack>
  );
}
