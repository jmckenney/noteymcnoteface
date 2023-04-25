import React from "react";
import { Button, Container, Grid, Typography } from "@mui/material";
import Header from "@/layouts/dashboard/header";
import Nav from "@/layouts/dashboard/nav";

export default function PageContainer({ children, title }) {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={3} mt={8} sx={{ display: { xs: "none", sm: "block" } }}>
          <Nav />
        </Grid>
        <Grid item xs={12} sm={9} mt={8}>
          <Typography variant="h4" sx={{ mb: 5 }}>
            {title}
          </Typography>
          {children}{" "}
        </Grid>
      </Grid>
    </Container>
  );
}
