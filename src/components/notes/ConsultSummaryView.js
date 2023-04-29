import React from "react";
import {
  CardContent,
  Stack,
  Typography,
  Box,
  Chip,
  Collapse,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Markdown from "@/components/Markdown";
import ConsultNoteCardHeader from "@/components/notes/ConsultNoteCardHeader";

export default function ConsultSummaryView({
  created,
  summary,
  markdownOutputOfTemplate,
  expandedFullNote,
  handleExpandFullNoteSummary,
}) {
  return (
    <>
      <ConsultNoteCardHeader created={created} />
      <CardContent>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label="High Risk Language"
            color="error"
            sx={{
              bgcolor: "#FAE6F4",
              color: "#972782",
              fontWeight: "bold",
              borderRadius: "5px",
              px: 1,
            }}
            size="small"
          />
          <Chip
            label="New Medications"
            color="success"
            sx={{
              bgcolor: "#F1DFFF",
              color: "#712DA7",
              fontWeight: "bold",
              borderRadius: "5px",
              px: 1,
            }}
            size="small"
          />
        </Stack>
        <Stack spacing={2}>
          <Typography variant="body">
            {summary ? (
              <>
                <strong>AI Summary:</strong> {summary}
              </>
            ) : (
              "Summary being created..."
            )}
          </Typography>
          <Box>
            <Typography
              variant="subtitle1"
              display="flex"
              onClick={handleExpandFullNoteSummary}
              sx={{ cursor: "pointer" }}
            >
              See Full Note
              <ExpandMoreIcon
                sx={{
                  transform: expandedFullNote ? "rotate(180deg)" : "none",
                }}
              />
            </Typography>
          </Box>
        </Stack>
      </CardContent>
      <Collapse in={expandedFullNote} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>More Info:</Typography>
          <Typography paragraph>
            <Markdown>
              {markdownOutputOfTemplate || "Full note being created..."}
            </Markdown>
          </Typography>
        </CardContent>
      </Collapse>
    </>
  );
}
