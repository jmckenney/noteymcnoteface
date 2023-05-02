import React, { useContext, useEffect } from "react";
import TeamNavigation from "@/components/TeamNavigation";
import { Typography, Box, Stack, Grid } from "@mui/material";
import CoolGraph from "../components/CoolGraph/CoolGraph";
import TeamContext from "@/hooks/TeamContext";

export default function Home() {
  const { setShowMemberName } = useContext(TeamContext);
  useEffect(() => {
    setShowMemberName(true);
  });
  return (
    <>
      <TeamNavigation />
      <Typography variant="h5" sx={{ mb: 3 }}>
        Member Summary
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <CoolGraph />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Stack spacing={3} sx={{ mt: 3, mb: 3 }}>
            <Box>
              <Typography variant="subtitle1">Past Consults</Typography>
              <p>2 with me</p>
              <p>1 with Dr. Smith, Psy.D</p>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
