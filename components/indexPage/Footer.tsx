import React from "react";
import FacebookIcon from "../../public/assets/facebook.png";
import InstagramIcon from "../../public/assets/instagram.png";
import TwitterIcon from "../../public/assets/twitter.png";
import { Box, Typography } from "@mui/material";
import logo from "../../public/assets/logobile.png";
import logo3 from "../../public/assets/logo1.png";

const Footer: React.FC = () => {
  const isMobile = window.innerWidth < 900;
  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          borderTop: "6px solid #B71DDE",
          marginTop: "2%",
          display: "flex",
          justifyContent: "center",
          padding: isMobile? "2%" : "1%",
        }}
      ></Box>
      {isMobile ? (
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ fontSize: "1.4vw", fontWeight: "bold" }}>
                <img
                  src={logo3.src}
                  alt="Logo"
                  style={{ width: "25em", height: "auto" }}
                />
                <span style={{ fontSize: "1.2vw" }}>
                  <Typography>Aplikace pro florbalové kluby</Typography>
                  <Typography>Efektivní komunikace</Typography>
                  <Typography>Vše na jednom místě</Typography>
                  <Typography>Správa více týmů v jednom klubu</Typography>
                </span>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              borderTop: "6px solid #B71DDE",
              marginTop: "2%",
              display: "flex",
              justifyContent: "center",
              padding: "2%",
            }}
          ></Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box sx={{ fontSize: "1.4vw", fontWeight: "bold" }}>
              <Typography>Kontakty: </Typography>
              <span style={{ fontSize: "1.2vw" }}>
                <Typography>appteammanager@gmail.com</Typography>
                <Typography>Lukáš Rolenec</Typography>
                <Typography>luky.rolenec@seznam.cz</Typography>
                <Typography>+420 732 742 713</Typography>
              </span>
            </Box>
          </Box>
          <Box
            sx={{
              borderTop: "6px solid #B71DDE",
              marginTop: "2%",
              display: "flex",
              justifyContent: "center",
              padding: "2%",
            }}
          ></Box>
          <Box sx={{ textAlign: "center", marginBottom: "2%" }}>
            <Box sx={{ fontSize: "1.4vw", fontWeight: "bold" }}>
              <Typography>Sledujte nás na sítích</Typography>
              <img
                src={FacebookIcon.src}
                alt="Facebook"
                style={{ marginRight: "4%", width: "6.5em", height: "6.5em" }}
              />
              <img
                src={InstagramIcon.src}
                alt="Instagram"
                style={{ marginRight: "4%", width: "6.5em", height: "6.5em" }}
              />
              <img
                src={TwitterIcon.src}
                alt="Twitter"
                style={{ marginRight: "4%", width: "6.5em", height: "6.5em" }}
              />
            </Box>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            marginLeft: ["%", "15%", "15%"],
            marginRight: "auto",
            flex: 3,
          }}
        >
          <Box
            sx={{
              flex: 1,
              textAlign: "left",
              fontSize: "1.4vw",
              fontWeight: "bold",
            }}
          >
            <img
              src={logo3.src}
              alt="Logo"
              style={{ width: "10em", height: "auto" }}
            />
            <span style={{ fontSize: "1.2vw" }}>
              <Typography>Aplikace pro florbalové kluby</Typography>
              <Typography>Efektivní komunikace</Typography>
              <Typography>Vše na jednom místě</Typography>
              <Typography>Správa více týmů v jednom klubu</Typography>
            </span>
          </Box>

          <Box
            sx={{
              flex: 1,
              textAlign: "left",
              fontSize: "1.4vw",
              fontWeight: "bold",
            }}
          >
            <Typography>Kontakty: </Typography>
            <span style={{ fontSize: "1.2vw" }}>
              <Typography>appteammanager@gmail.com</Typography>
              <Typography>Lukáš Rolenec</Typography>
              <Typography>luky.rolenec@seznam.cz</Typography>
              <Typography>+420 732 742 713</Typography>
            </span>
          </Box>

          <Box
            sx={{
              flex: 1,
              textAlign: "left",
              fontSize: "1.4vw",
              fontWeight: "bold",
            }}
          >
            <Typography sx={{marginBottom:"1em"}}>Sledujte nás na sítích</Typography>
            <img
              src={FacebookIcon.src}
              alt="Facebook"
              style={{ marginRight: "4%", width: "2.5em", height: "2.5em" }}
            />
            <img
              src={InstagramIcon.src}
              alt="Instagram"
              style={{ marginRight: "4%", width: "2.5em", height: "2.5em" }}
            />
            <img
              src={TwitterIcon.src}
              alt="Twitter"
              style={{ marginRight: "4%", width: "2.5em", height: "2.5em" }}
            />
          </Box>
        </Box>
      )}
      <Box
        sx={{
          backgroundColor: "#B71DDE",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          marginTop: isMobile ? "0" : "1%",
          fontWeight: "bold",
          fontSize: "1.4vw",
        }}
      >
        <img
          src={logo.src}
          alt="Logo"
          style={{ width: isMobile ? "20em" :"10em", height: "auto", marginTop: "0.5em" }}
        />
      </Box>
    </Box>
  );
};

export default Footer;
