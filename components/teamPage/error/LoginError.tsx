import React from "react";
import pictureBackground from "../../../public/assets/uvodni1.jpg";
import photo from "../../../public/assets/rosterbot.png";
import { Box, Button, Typography, Link, Alert } from "@mui/material";
import logo from "../../../public/assets/logo3.png";

function RoleError() {
  return (
    <Box
      sx={{
        backgroundColor: "#F0F2F5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "80%",
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.4)",
          borderRadius: "15px",
          margin: "0 1rem",
          position: "relative",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Box
            sx={{
              width: "90%",
              position: "relative",
              zIndex: "1", // Ensure content is above the background image
              borderRadius: "0 0 15px 15px",
            }}
          >
            <img
              src={pictureBackground.src}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.85,
                borderRadius: "15px 0 0px 15px",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                zIndex: "2", // Set a higher z-index for content
              }}
            >
              <Box
                sx={{
                  marginLeft: "10%",
                  marginRight: "10%",
                  zIndex: "999",
                  marginTop: "1.5em",
                }}
              >
                <img src={logo.src} alt="logo" width="20%" height="auto" />

                <Typography
                  variant="h4"
                  sx={{
                    margin: "1rem",
                    marginTop: "0em",
                    marginBottom: "",
                    fontSize: "4vw",
                    fontFamily: "Roboto",
                    marginLeft: "10%",
                    fontWeight: "bold",
                    color: "white",
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  Aplikace pro klubovou správu
                </Typography>
              </Box>
              <Box
                sx={{
                  marginLeft: "15%",
                  marginRight: "15%",
                  zIndex: "999",
                  marginTop: "1em",
                  position: "relative",
                }}
              >
                <img src={photo.src} alt="logo" width="80%" height="auto" />
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              width: "40%",
              height: "50%",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Roboto",
                fontWeight: "700",
                marginLeft: "1em",
                marginRight: "1em",
              }}
            >
              Chyba:
            </Typography>

            <Alert
              severity="error"
              sx={{ marginTop: "1em", marginLeft: "1em", marginRight: "1em" }}
            >
              <Typography variant="h6">
                Pro tuto akci je třeba se přihlásit
              </Typography>
            </Alert>
            <Link sx={{ textDecoration: "none" }} href="/LoginPage">
              <Button
                variant="contained"
                color="primary"
                sx={{
                  marginTop: "1rem",
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "block",
                  backgroundColor: "#FFE0FE",
                  color: "black",
                  fontFamily: "Roboto",
                  fontWeight: "700",
                  border: "1px solid #ff96fc",
                  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                  padding: "0.7em",
                  borderRadius: "4px",
                  textDecoration: "none",
                  width: "80%",
                  "&:hover": { backgroundColor: "#b71dde", }
                }}
              >
                <Typography
                  sx={{
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                    fontSize: "Roboto",
                    fontWeight: "600",
                  }}
                  variant="h5"
                >
                  Přihlásit
                </Typography>
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default RoleError;
