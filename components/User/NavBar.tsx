import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";

const NavBar: React.FC = () => {
  const router = useRouter();

  const handleIconButtonClick = () => {
    router.push("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon onClick={handleIconButtonClick} />
          </IconButton>
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, marginLeft: "auto", marginRight: "auto" }}
            >
              Úprava profilu
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
