import { styled, alpha } from "@mui/material/styles";
import { Box, Link, Typography, Avatar } from "@mui/material";
import NavSection from "@/components/nav-section";
import navConfig from "./config";

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const StyledAccount = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

export default function Nav() {
  const renderContent = (
    <>
      <Link underline="none">
        <StyledAccount>
          <Avatar src="" alt="photoURL" />

          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle2" sx={{ color: "text.primary" }}>
              Natalie Beg
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Distinguished Senior Engineer
            </Typography>
          </Box>
        </StyledAccount>
      </Link>
      <NavSection data={navConfig} />
      <Box sx={{ flexGrow: 1 }} />
    </>
  );

  return <Box>{renderContent}</Box>;
}
