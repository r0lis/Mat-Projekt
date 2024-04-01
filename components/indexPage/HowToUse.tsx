import { Box, Typography } from "@mui/material";
import React from "react";
import LeftDownArr from "../../public/assets/arrowLeftDown.png";
import RightDownArr from "../../public/assets/arrowRightDown.png";

const HowToUse: React.FC = () => {
  return (
    <Box style={{ zIndex: "-999", backgroundColor: "#F0F2F5" }}>
      <Box
        sx={{
          borderLeft: "6.5px solid #B71DDE",
          position: "relative",
          marginLeft: "10%",
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
              marginLeft: "30%",
              fontSize: "2.2vw",
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
                  width: "50%",
                  height: "10em",
                  marginLeft: "1.5%",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "1.8vw",
                  backgroundImage:
                    "linear-gradient(to bottom, #B71DDE 20%, white 20%)",
                }}
              >
                <Box
                  sx={{
                    display: "block",
                    paddingTop: "0.5em",
                    paddingBottom: "0.2em",
                    borderBottom: "2px solid black",
                  }}
                >
                  <Typography
                    sx={{
                      top: "0%",
                      color: "white",
                      fontSize: "1.5vw",
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
                    paddingTop: "10%",
                    paddingBottom: "auto",
                    marginRight: "5%",
                    display: "block",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.4vw",
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
                  marginLeft: "25%",
                }}
                src={LeftDownArr.src}
                alt="arrow"
              />
              <Box
                sx={{
                  marginBottom: "8%",
                  width: "50%",
                  height: "10em",
                  marginRight: 0,
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "1.8vw",
                  backgroundImage:
                    "linear-gradient(to bottom, #B71DDE 20%, white 20%)",
                }}
              >
                <Box
                  sx={{
                    display: "block",
                    paddingTop: "0.5em",
                    paddingBottom: "0.2em",
                    borderBottom: "2px solid black",
                  }}
                >
                  <Typography
                    sx={{
                      top: "0%",
                      color: "white",
                      fontSize: "1.5vw",
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
                    paddingTop: "10%",
                    paddingBottom: "auto",
                    marginRight: "5%",
                    display: "block",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.4vw",
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
                  width: "50%",
                  height: "10em",
                  marginLeft: "1.5%",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "1.8vw",
                  backgroundImage:
                    "linear-gradient(to bottom, #B71DDE 20%, white 20%)",
                }}
              >
                <Box
                  sx={{
                    display: "block",
                    paddingTop: "0.5em",
                    paddingBottom: "0.2em",
                    borderBottom: "2px solid black",
                  }}
                >
                  <Typography
                    sx={{
                      top: "0%",
                      color: "white",
                      fontSize: "1.5vw",
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
                    paddingTop: "10%",
                    paddingBottom: "auto",
                    marginRight: "5%",
                    display: "block",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.4vw",
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
                }}
                src={RightDownArr.src}
                alt="arrow"
              />
            </Box>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  marginBottom: "8%",
                  width: "50%",
                  height: "10em",
                  marginRight: 0,
                  marginLeft: "37%",
                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                  fontSize: "1.8vw",
                  backgroundImage:
                    "linear-gradient(to bottom, #B71DDE 20%, white 20%)",
                }}
              >
                <Box
                  sx={{
                    display: "block",
                    paddingTop: "0.5em",
                    paddingBottom: "0.2em",
                    borderBottom: "2px solid black",
                  }}
                >
                  <Typography
                    sx={{
                      top: "0%",
                      color: "white",
                      fontSize: "1.5vw",
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
                    paddingTop: "10%",
                    paddingBottom: "auto",
                    marginRight: "5%",
                    display: "block",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.4vw",
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
