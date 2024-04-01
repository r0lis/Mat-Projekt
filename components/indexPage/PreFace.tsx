import React from "react";
import pictureBackground from "../../public/assets/uvodni1.jpg";
import pictureAppPreviewForBackground from "../../public/assets/pictuteappforbackground.png";
import arrowRight from "../../public/assets/arrow-right.png";
import { Box } from "@mui/material";

const PreFace: React.FC = () => {
  const isMobile = window.innerWidth < 900;
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "auto",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        <img
          src={pictureBackground.src}
          alt="Popis obrázku"
          width={"100%"}
          height={"auto"}
          max-width={"100%"}
        />
      </Box>
      <Box
        sx={{
          width: "27%",
          position: "absolute",
          left: ["8%","10%","15%"],
          height: "50%",
          marginTop: "0",
          textAlign: "left",
          padding: "1em",
          top: ["2%", "8%", "10%"],
        }}
      >
        <Box
          sx={{
            fontSize: ["1.5em", "2.1em", "3.5em",],
            fontWeight: "bold",
            color: "white",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            marginBottom: "10px",
          }}
        >
          WEBOVÁ APLIKACE PRO FLORBALOVÉ KLUBY
        </Box>
        {isMobile ? (<Box></Box>) : (
        <Box
          sx={{
            fontSize: ["0.7em", "0.9em", "1.15em",],
            color: "white",
            fontFamily:"Roboto",
          }}
        >
          Aplikace pro efektivní správu klubu, týmů, hráčů a další.. Mějte
          veškerý přehled o vašem klubu na jednom místě. Aplikace je zdarma a má
          několik funkcí a výhod.
        </Box>
        )}
        <Box
          sx={{
            fontSize: ["0.9em", "1.1em", "1.15em",],
            color: "black",
            display: "flex",
            whiteSpace: "nowrap",
            marginTop: ["12%", "10%", "18%"],
            width: "100%",
            marginLeft: "10%",
            alignItems: "center",
            fontWeight: "bold",
            paddingRight: "10%",
          }}
        >
          <img
            src={arrowRight.src}
            alt="arrowRight"
            height={ isMobile? "12%" :"8%"}
            width={isMobile? "12%" :"8%"}
            style={{ marginRight: "2%" }}
          />{" "}
          OBJEV VÝHODY
          <Box
            sx={{
              fontSize: [ "0.9em", "1.1em", "1.25em"],
              color: "white",
              paddingLeft: "10%",
            }}
          >
            See features
          </Box>
        </Box>
      </Box>
      <Box sx={{
        width: "32%",
        height: "auto",
        maxWidth: "100%",
        position: "absolute",
        top: "5%",
        right: "15%",
        transform: "translateY(0)",
        zIndex: 1,
      }}>
        <img
          src={pictureAppPreviewForBackground.src}
          alt="Popis obrázku"
          width={"100%"}
          height={"auto"}
          max-width={"100%"}
        />
      </Box>
    </Box>
  );
};

export default PreFace;