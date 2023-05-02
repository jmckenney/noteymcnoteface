import React, { useContext, useEffect } from "react";
import TeamNavigation from "@/components/TeamNavigation";
import { Typography } from "@mui/material";
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
      <CoolGraph />
    </>
  );
}
