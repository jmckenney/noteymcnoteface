import { Button, Container, Grid, Typography, Stack } from "@mui/material";
import Header from "@/layouts/dashboard/header";
import Nav from "@/layouts/dashboard/nav";
import TemplateRenderer from "@/components/TemplateRenderer";
import { useState } from "react";

// ----------------------------------------------------------------------

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={4} mt={8}>
          <Nav />
        </Grid>
        <Grid item xs={8} mt={8}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Notes for Tristen
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={3}>
                <Button variant="outlined" onClick={() => setOpen(true)}>
                  Initial Consult Note
                </Button>
                {open && (
                  <TemplateRenderer>Rendered form here</TemplateRenderer>
                )}

                <Typography variant="h5" sx={{ mb: 5 }}>
                  In Progress Notes
                </Typography>
                {/* render in progress notes */}

                <Typography variant="h5" sx={{ mb: 5 }}>
                  Finalized Notes
                </Typography>
                {/* render finalized notes */}
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
