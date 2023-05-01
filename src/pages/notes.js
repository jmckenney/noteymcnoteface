import {
  Box,
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
  Tabs,
  Tab,
  TextField,
} from "@mui/material";
import TemplateRenderer from "@/components/TemplateRenderer";
import NoteList from "@/components/notes/NoteList";
import { useState } from "react";
import PageContainer from "@/layouts/dashboard/DashboardLayout";
import MockVideoConsultWindow from "@/components/MockVideoConsultWindow";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("IN_PROGRESS");
  const [showVideoConsult, setShowVideoConsult] = useState(false);
  return (
    <PageContainer
      title="Tristin McNotey"
      videoButton
      onVideoButtonClick={() => setShowVideoConsult(!showVideoConsult)}
    >
      <Box sx={{ bgcolor: "background.paper", mb: 3 }}>
        <Tabs
          onChange={() => console.log("changed")}
          variant="scrollable"
          scrollButtons={false}
          value="notes"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Member Summary" />
          <Tab label="Key Information" />
          <Tab label="Care Team" />
          <Tab label="Goals" />
          <Tab label="Notes & Plan" value="notes" />
          <Tab label="Programs" />
          <Tab label="Consultations" />
          <Tab label="Content Cards" />
          <Tab label="Scheduled" />
        </Tabs>
      </Box>
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
              Create New Note
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
            <NoteList state={filterBy} />
          </Stack>
        </Grid>
      </Grid>
      {showVideoConsult && <MockVideoConsultWindow />}
    </PageContainer>
  );
}
