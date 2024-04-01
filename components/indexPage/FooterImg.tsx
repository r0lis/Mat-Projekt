import React from "react";
import FooterImage from "./../../public/assets/teamphoto.jpg";
import { Box } from "@mui/material";

const FooterImg: React.FC = () => {
  return (
    <Box
      sx={{ position: "relative", height: "60vh", backgroundColor: "#F0F2F5",}}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(255, 224, 254)",
        }}
      ></Box>
      <img
        src={FooterImage.src}
        alt="Týmový obrázek"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.5,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          fontSize: ["2.5em", "3em", "4em"],
          textAlign: "center",
          opacity: 1,
          fontWeight: "bold",
        }}
      >
        Enjoy and build your <span style={{ color: "#B71DDE" }}>club</span>{" "}
      </Box>
    </Box>
  );
};

export default FooterImg;
