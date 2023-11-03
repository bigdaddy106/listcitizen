import { Link, useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      mt={2}
      mb={3}
    >
      <img
        src="/logo.png"
        width="64px"
        height="64px"
        style={{ borderRadius: 999, cursor: "pointer" }}
        alt="Logo"
        onClick={() => navigate("/")}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "48px",
        }}
      >
        <Link to="/citizens" style={{ textDecoration: "none" }}>
          <Typography variant="subtitle1">Citizens</Typography>
        </Link>
        <Link to="/add" style={{ textDecoration: "none" }}>
          <Typography variant="subtitle1">Add</Typography>
        </Link>
        <ConnectButton
          label="Connect Wallet"
          accountStatus={{ smallScreen: "address", largeScreen: "full" }}
          chainStatus="icon"
          showBalance={{ smallScreen: false, largeScreen: true }}
        />
      </Box>
    </Stack>
  );
}
