import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Chip,
  CardContent,
  CardActions,
  Stack,
  Typography,
  CardHeader,
  Avatar,
  IconButton,
  Collapse,
} from "@mui/material";
import { red } from "@mui/material/colors";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { styled } from "@mui/material/styles";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function NoteList({ state }) {
  const [notes, setNotes] = useState([]);
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch(`/api/notes?state=${state}&limit=10`);
      const notesJson = await response.json();
      setNotes(notesJson);
    };
    fetchNotes();
  }, [state]);

  return (
    <Stack spacing={3}>
      {notes.length ? (
        notes.map((note) => {
          switch (note.noteType) {
            case "CONSULT_ENCOUNTER":
              return (
                <Card key={note._id}>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: red[500] }}>LS</Avatar>}
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title="Consult Note"
                    subheader={
                      note.created
                        ? formatter.format(new Date(note.created))
                        : ""
                    }
                  />
                  <CardContent>
                    <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                      <Chip
                        label="High Risk Language"
                        color="error"
                        size="small"
                      />
                      <Chip
                        label="New Medications"
                        color="success"
                        size="small"
                      />
                    </Stack>
                    <Typography variant="body">
                      In the health coaching follow-up session, the member
                      discussed their struggles in reaching 10,000 steps daily
                      and considered ways to make physical activity more
                      enjoyable. The wellness plan includes goals such as
                      limiting fast food, achieving daily step targets, and
                      exploring various activities to increase movement.
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <ExpandMore
                      expand={expanded}
                      onClick={handleExpandClick}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CardActions>
                  <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                      <Typography paragraph>More Info:</Typography>
                      <Typography paragraph>
                        lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                      </Typography>
                    </CardContent>
                  </Collapse>
                </Card>
              );
              break;

            default:
              break;
          }
        })
      ) : (
        <>Loading Template...</>
      )}
    </Stack>
  );
}
