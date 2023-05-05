import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function TeamNavigation() {
  const currentPage = usePathname();
  return (
    <Box sx={{ bgcolor: "background.paper", mb: 3 }}>
      <Tabs
        onChange={() => console.log("changed")}
        variant="scrollable"
        scrollButtons={false}
        value={currentPage}
        aria-label="scrollable auto tabs example"
      >
        <Tab
          label={
            <Link href="/member-summary" passHref>
              Member Summary
            </Link>
          }
          value="/member-summary"
        />
        <Tab label="Key Information" />
        <Tab label="Care Team" />
        <Tab label="Goals" />
        <Tab
          label={
            <Link href="/notes" passHref>
              Notes
            </Link>
          }
          value="/notes"
        />
        <Tab label="Programs" />
        <Tab label="Consultations" />
        <Tab label="Content Cards" />
        <Tab label="Scheduled" />
      </Tabs>
    </Box>
  );
}
