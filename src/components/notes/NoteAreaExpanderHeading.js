import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const NoteAreaExpanderHeading = ({ title, handleClick }) => {
  return (
    <Box
      sx={{
        padding: 2,
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#F9FAFB",
        },
      }}
      onClick={handleClick}
    >
      <Grid
        container
        spacing={2}
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid item xs={1}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.5 7.27774L12 12M12 12L3.49997 7.27774M12 12L12 21.5M21 16.0585V7.94144C21 7.5988 21 7.42747 20.9495 7.27468C20.9049 7.1395 20.8318 7.01542 20.7354 6.91073C20.6263 6.79239 20.4766 6.70919 20.177 6.54279L12.777 2.43168C12.4934 2.27412 12.3516 2.19534 12.2015 2.16445C12.0685 2.13712 11.9315 2.13712 11.7986 2.16445C11.6484 2.19534 11.5066 2.27412 11.223 2.43168L3.82297 6.54279C3.52345 6.70919 3.37369 6.79239 3.26463 6.91073C3.16816 7.01542 3.09515 7.1395 3.05048 7.27468C3 7.42748 3 7.5988 3 7.94144V16.0585C3 16.4012 3 16.5725 3.05048 16.7253C3.09515 16.8605 3.16816 16.9846 3.26463 17.0893C3.37369 17.2076 3.52345 17.2908 3.82297 17.4572L11.223 21.5683C11.5066 21.7259 11.6484 21.8046 11.7986 21.8355C11.9315 21.8629 12.0685 21.8629 12.2015 21.8355C12.3516 21.8046 12.4934 21.7259 12.777 21.5683L20.177 17.4572C20.4766 17.2908 20.6263 17.2076 20.7354 17.0893C20.8318 16.9846 20.9049 16.8605 20.9495 16.7253C21 16.5725 21 16.4012 21 16.0585Z"
              stroke="#7F56D9"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Grid>
        <Grid item xs={10}>
          <Typography variant="subtitle1">{title}</Typography>
        </Grid>
        <Grid item xs={1}>
          <ExpandMoreIcon />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NoteAreaExpanderHeading;
