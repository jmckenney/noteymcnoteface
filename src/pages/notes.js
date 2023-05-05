import {
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import TemplateRenderer from "@/components/TemplateRenderer";
import NoteList from "@/components/notes/NoteList";
import { useContext, useCallback, useState, useEffect } from "react";
import TeamNavigation from "@/components/TeamNavigation";
import TeamContext from "@/hooks/TeamContext";
import NotesContext from "@/hooks/NotesContext";

export default function Home() {
  const [open, setOpen] = useState(false);

  const { setShowMemberName } = useContext(TeamContext);
  const { notes, fetchNotes, filterBy, setFilterBy } = useContext(NotesContext);

  useEffect(() => {
    setShowMemberName(true);
  }, [setShowMemberName]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return (
    <>
      <TeamNavigation />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Plans
          </Typography>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <TextField
                  label="Coaching Plan"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                />
                <TextField
                  label="Therapy Plan"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                />
                <TextField
                  label="Prescribing Plan"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Stack spacing={3}>
            <Button variant="outlined" onClick={() => setOpen(true)}>
              New Consult Note
            </Button>
            {open && <TemplateRenderer>Rendered form here</TemplateRenderer>}

            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Filter Notes By Note State
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterBy}
                label="Filter Notes By Note State"
                onChange={(e) => setFilterBy(e.target.value)}
              >
                <MenuItem value="IN_PROGRESS">In Progress Notes</MenuItem>
                <MenuItem value="FINALIZED">Finalized Notes</MenuItem>
              </Select>
            </FormControl>
            <NoteList notes={notes} />
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
