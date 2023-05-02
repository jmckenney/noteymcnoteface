import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
} from "@mui/material";
import Link from "next/link";

// ----------------------------------------------------------------------

export default function Home() {
  return (
    <>
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
    </>
  );
}
