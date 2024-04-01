import React from "react";
import FacebookIcon from "../../public/assets/facebook.png";
import InstagramIcon from "../../public/assets/instagram.png";
import TwitterIcon from "../../public/assets/twitter.png";
import { Box, Typography } from "@mui/material";
import logo from "../../public/assets/logobile.png";

const Footer: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          borderTop: "6px solid #B71DDE",
          marginTop: "5%",
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          "@media screen and (max-width: 768px)": {
            borderTop: "5px solid #B71DDE",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            marginLeft: "15%",
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
            <Typography>LOGO ProFlorbal</Typography>
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
            <Typography>Sledujte nás na sítích</Typography>
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
      </Box>
      <Box
        sx={{
          backgroundColor: "#B71DDE",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.4vw",
        }}
      >
        <img
          src={logo.src}
          alt="Logo"
          style={{ width: "10em", height: "auto", marginTop:"0.5em"}}
        />
      </Box>
    </>
  );
};

export default Footer;
