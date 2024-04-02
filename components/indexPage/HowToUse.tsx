import { Box, Typography } from "@mui/material";
import React from "react";
import LeftDownArr from "../../public/assets/arrowLeftDown.png";
import RightDownArr from "../../public/assets/arrowRightDown.png";

const HowToUse: React.FC = () => {
  const isMobile = window.innerWidth < 900;
  return (
    <Box style={{ zIndex: "-999", backgroundColor: "#F0F2F5" }}>
      <Box
        sx={{
          borderLeft: "6.5px solid #B71DDE",
          position: "relative",
          marginLeft: ["7%", "10%", "10%"],
          backgroundColor: "#F0F2F5",
          "@media screen and (max-width: 768px)": {
            borderLeft: "5px solid #B71DDE",
          },
        }}
      >
        <Box
          sx={{
            fontSize: "1.2vw",
            color: "black",
            paddingLeft: "5%",
            paddingTop: "5%",
          }}
        >
          <Typography
            sx={{
              display: "block",
              marginLeft: ["20%", "22%", "30%"],
              fontSize: ["3em", "3em", "2em"],
              paddingTop: "6%",
              paddingBottom: "5%",
              fontWeight: "bold",
            }}
          >
            Jak začít aplikaci{" "}
            <span style={{ color: "#B71DDE" }}>používat</span> ?
          </Typography>
        </Box>
        <Box className="leftBorderDivBack">
          <Box sx={{ position: "relative", marginLeft: "14%" }}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  marginBottom: "8%",
                  width: ["90%", "60%", "50%"],
                  height: ["12em", "10em", "10em"],
                  marginLeft: ["", "1.3%", "1.5%"],
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                  borderRadius: ["10px", "15px", "20px"],
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "1.8vw",
                  backgroundImage: isMobile
                    ? "linear-gradient(to bottom, #B71DDE 30%, white 30%)"
                    : "linear-gradient(to bottom, #B71DDE 20%, white 20%)",
                }}
              >
                <Box
                  sx={{
                    display: "block",
                    paddingTop: isMobile ? "0.4em" : "0.4em",
                    paddingBottom: isMobile ? "0.5em" : "0.3em",
                    borderBottom: isMobile
                      ? "1px solid black"
                      : "2px solid black",
                  }}
                >
                  <Typography
                    sx={{
                      top: "0%",
                      color: "white",
                      fontSize: isMobile ? "1.7em" : "1.5vw",
                      fontFamily: "Roboto",
                      fontWeight: "500",
                    }}
                  >
                    Krok 1
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: "5%",
                    paddingTop: ["5%", "8%", "10%"],
                    paddingBottom: "auto",
                    marginRight: "5%",
                    display: "block",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: ["1.4em", "1.3em", "1.4vw"],
                      textAlign: "center",
                      justifyContent: "center",
                      fontFamily: "Roboto",
                      fontWeight: "500",
                    }}
                  >
                    Zaregistujte se do aplikace.
                  </Typography>
                </Box>
              </Box>
              <img
                style={{
                  width: "10%",
                  height: "10%",
                  left: 0,
                  marginTop: "20%",
                  marginRight: isMobile ? "5%" : 0,
                }}
                src={RightDownArr.src}
                alt="arrow"
              />
            </Box>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <img
                style={{
                  width: "10%",
                  height: "10%",
                  left: 0,
                  marginTop: "20%",
                  marginLeft: isMobile ? "0" : "25%",
                }}
                src={LeftDownArr.src}
                alt="arrow"
              />
              <Box
                sx={{
                  marginRight: isMobile ? "5%" : 0,
                  marginBottom: "8%",
                  width: ["90%", "60%", "50%"],
                  height: ["12em", "10em", "10em"],
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                  borderRadius: ["10px", "15px", "20px"],
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "1.8vw",
                  backgroundImage: isMobile
                    ? "linear-gradient(to bottom, #B71DDE 30%, white 30%)"
                    : "linear-gradient(to bottom, #B71DDE 20%, white 20%)",
                }}
              >
                <Box
                  sx={{
                    display: "block",
                    paddingTop: isMobile ? "0.4em" : "0.4em",
                    paddingBottom: isMobile ? "0.5em" : "0.3em",
                    borderBottom: isMobile
                      ? "1px solid black"
                      : "2px solid black",
                  }}
                >
                  <Typography
                    sx={{
                      top: "0%",
                      color: "white",
                      fontSize: isMobile ? "1.7em" : "1.5vw",
                      fontFamily: "Roboto",
                      fontWeight: "500",
                    }}
                  >
                    Krok 2
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: "5%",
                    paddingTop: ["5%", "8%", "10%"],
                    paddingBottom: "auto",
                    marginRight: "5%",
                    display: "block",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: ["1.4em", "1.3em", "1.4vw"],
                      textAlign: "center",
                      justifyContent: "center",
                      fontFamily: "Roboto",
                      fontWeight: "500",
                    }}
                  >
                    Vytvořte váš klub, pozvěte všechny členy klubu do aplikace.
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  marginBottom: "8%",
                  width: ["90%", "60%", "50%"],
                  height: ["12em", "10em", "10em"],
                  marginLeft: ["", "1.3%", "1.5%"],
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                  borderRadius: ["10px", "15px", "20px"],
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "1.8vw",
                  backgroundImage: isMobile
                    ? "linear-gradient(to bottom, #B71DDE 30%, white 30%)"
                    : "linear-gradient(to bottom, #B71DDE 20%, white 20%)",
                }}
              >
                <Box
                  sx={{
                    display: "block",
                    paddingTop: isMobile ? "0.4em" : "0.4em",
                    paddingBottom: isMobile ? "0.5em" : "0.3em",
                    borderBottom: isMobile
                      ? "1px solid black"
                      : "2px solid black",
                  }}
                >
                  <Typography
                    sx={{
                      top: "0%",
                      color: "white",
                      fontSize: isMobile ? "1.7em" : "1.5vw",
                      fontFamily: "Roboto",
                      fontWeight: "500",
                    }}
                  >
                    Krok 3
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: "5%",
                    paddingTop: ["3%", "6%", "10%"],
                    paddingBottom: "auto",
                    marginRight: "5%",
                    display: "block",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: ["1.4em", "1.3em", "1.4vw"],
                      textAlign: "center",
                      justifyContent: "center",
                      fontFamily: "Roboto",
                      fontWeight: "500",
                    }}
                  >
                    Dokončete nastavení klubu, práv, veškeré potřebné kroky pro
                    kompletaci vytvoření klubu a začněte aplikaci používat.
                  </Typography>
                </Box>
              </Box>
              <img
                style={{
                  width: "10%",
                  height: "10%",
                  left: 0,
                  marginTop: "20%",
                  marginRight: isMobile ? "5%" : 0,
                }}
                src={RightDownArr.src}
                alt="arrow"
              />
            </Box>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  marginLeft: isMobile ? "10%" : "37%",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                  marginBottom: "8%",
                  marginRight: isMobile ? "5%" : 0,
                  width: ["90%", "60%", "50%"],
                  height: ["12em", "10em", "10em"],
                  borderRadius: ["10px", "15px", "20px"],
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "1.8vw",
                  backgroundImage: isMobile
                    ? "linear-gradient(to bottom, #B71DDE 30%, white 30%)"
                    : "linear-gradient(to bottom, #B71DDE 20%, white 20%)",
                }}
              >
                <Box
                  sx={{
                    display: "block",
                    paddingTop: isMobile ? "0.4em" : "0.4em",
                    paddingBottom: isMobile ? "0.5em" : "0.3em",
                    borderBottom: isMobile
                      ? "1px solid black"
                      : "2px solid black",
                  }}
                >
                  <Typography
                    sx={{
                      top: "0%",
                      color: "white",
                      fontSize: isMobile ? "1.7em" : "1.5vw",
                      fontFamily: "Roboto",
                      fontWeight: "500",
                    }}
                  >
                    Poslední krok{" "}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    paddingLeft: "5%",
                    paddingTop: ["3%", "6%", "10%"],
                    paddingBottom: "auto",
                    marginRight: "5%",
                    display: "block",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: ["1.4em", "1.3em", "1.4vw"],
                      textAlign: "center",
                      justifyContent: "center",
                      fontFamily: "Roboto",
                      fontWeight: "500",
                    }}
                  >
                    Začněte aplikaci používat a využívat všechny její funkce,
                    mějte lepší přehled o vašem klubu.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HowToUse;
