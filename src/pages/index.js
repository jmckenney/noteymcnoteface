import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Typography,
  Stack,
} from "@mui/material";
import Header from "@/layouts/dashboard/header";
import Nav from "@/layouts/dashboard/nav";
import { useState } from "react";
import Link from "next/link";

// ----------------------------------------------------------------------

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={3} mt={8}>
          <Nav />
        </Grid>
        <Grid item xs={9} mt={8}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Welcome to the note revolution
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={3}>
                <Card>
                  <CardActionArea component={Link} href="/notes">
                    <CardContent>
                      <Typography variant="h5">Notes In Action</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card>
                  <CardActionArea component={Link} href="/create-template">
                    <CardContent>
                      <Typography variant="h5">Template Creator</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card>
                  <CardActionArea component={Link} href="/create-form">
                    <CardContent>
                      <Typography variant="h5">Form Creator</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
