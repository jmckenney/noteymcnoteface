import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import { useState } from "react";
import Link from "next/link";
import PageContainer from "../layouts/dashboard/DashboardLayout";

// ----------------------------------------------------------------------

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <PageContainer>
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
    </PageContainer>
  );
}
