import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

function chatBubble({ index, message }) {
  return (
    <Card
      key={index}
      sx={
        message.role === "user"
          ? {
              marginBottom: 1,
              marginLeft: "auto",
              marginRight: 10,
              backgroundColor: "#0084ff",
              color: "white",
            }
          : {
              marginBottom: 1,
              marginRight: "auto",
              marginLeft: 10,
              backgroundColor: "#f0f0f0",
              color: "black",
            }
      }
    >
      <CardContent
        sx={{
          padding: 1,
          "&:last-child": {
            paddingBottom: 1,
          },
        }}
      >
        <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
          {message.content}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default chatBubble;
