import { Box, Typography } from "@mui/material";
import React from "react";
import comunicationImg from "../../public/assets/message.png";
import teamImg from "../../public/assets/network.png";
import listHospitalImg from "../../public/assets/patient.png";
import trainingPlanImg from "../../public/assets/training.png";
import Settings from "../../public/assets/Settings.png";

const AppContent: React.FC = () => {
  const isMobile = window.innerWidth < 900;
  return (
    <Box style={{ zIndex: "-999", backgroundColor: "#F0F2F5" }}>
      <Box sx={{ zIndex: "50" }}>
        <Box
          sx={{
            backgroundColor: "#F0F2F5",
            borderLeft: "6.5px solid #B71DDE",
            position: "relative",
            marginLeft: ["7%", "10%", "10%",],
            "@media screen and (max-width: 768px)": {
              borderLeft: "5px solid #B71DDE",
            },
          }}
        >
          <Box
          id="Obsah"
            sx={{
              fontSize: "1.2vw",
              color: "black",
              paddingLeft: "5%",
              paddingTop: "5%",
            }}
          >
            <Typography sx={{ fontSize: ["3em","3em", "2em"], fontWeight: "bold" }}>
              Co aplikace <span style={{ color: "#B71DDE" }}>poskytuje</span> ?
            </Typography>
          </Box>
          <Box
            style={{ backgroundColor: "#F0F2F5" }}
            sx={{
              position: "relative",
              marginLeft: ["4%", "7%", "14%"],
              backgroundColor: "F0F2F5",
            }}
          >
            <Box
              sx={{
                content: "''",
                position: "absolute",
                top: 0,
                left: "-5px",
                height: "100%",
                width: "6px",
                backgroundColor: "#B71DDE",
                borderRadius: "10px",
                "@media screen and (max-width: 768px)": {
                  width: "1px",
                  borderLeft: "5px solid #B71DDE",
                },
              }}
            ></Box>
            <Box
              sx={{
                textAlign: "center",
                justifyContent: "center",
                backgroundColor: "#F0F2F5",
              }}
            >
              <Box
                sx={{
                  marginTop: "7%",
                  marginBottom: "7%",
                  width: ["67%", "60%", "50%"],
                  padding: "5% 10% 5% 10%",
                  marginLeft: "1.5%",
                  marginRight: "auto",
                  backgroundColor: "#FFE0FE",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  textAlign: "center",
                  display: "flex",
                  fontSize: ["0.9em", "1.5em", "1.8em"],
                  alignItems: "center",
                  border: "1px solid #ff96fc",
                }}
              >
                <img
                style={{ width: isMobile? "13%": "10%", marginRight: "5%" }}
                src={comunicationImg.src}
                />
                Skvělá komunikace v klubu
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              position: "relative",
              marginLeft: ["4%", "7%", "14%"],
              backgroundColor: "#F0F2F5",
            }}
          >
            <Box
              sx={{
                content: "''",
                position: "absolute",
                top: 0,
                left: "-5px",
                height: "100%",
                width: "6px",
                backgroundColor: "#B71DDE",
                borderRadius: "10px",
                "@media screen and (max-width: 768px)": {
                  width: "1px",
                  borderLeft: "5px solid #B71DDE",
                },
              }}
            ></Box>{" "}
            <Box
              sx={{
                marginTop: "7%",
                marginBottom: "7%",
                width: ["67%", "60%", "50%"],
                padding: "5% 10% 5% 10%",
                marginLeft: "1.5%",
                marginRight: "auto",
                backgroundColor: "#FFE0FE",
                borderRadius: "10px",
                fontWeight: "bold",
                textAlign: "center",
                display: "flex",
                fontSize: ["0.9em", "1.5em", "1.8em"],
                alignItems: "center",
                border: "1px solid #ff96fc",
              }}
            >
              <img
                style={{ width: isMobile? "13%": "10%", marginRight: "5%" }}
                src={Settings.src}
              />{" "}
              Správa více týmů v klubu
            </Box>
          </Box>
          <Box
            sx={{
              position: "relative",
              marginLeft: ["4%", "7%", "14%"],
              backgroundColor: "#F0F2F5",
            }}
          >
            <Box
              sx={{
                content: "''",
                position: "absolute",
                top: 0,
                left: "-5px",
                height: "100%",
                width: "6px",
                backgroundColor: "#B71DDE",
                borderRadius: "10px",
                "@media screen and (max-width: 768px)": {
                  width: "1px",
                  borderLeft: "5px solid #B71DDE",
                },
              }}
            ></Box>{" "}
            <Box
              sx={{
                marginTop: "7%",
                marginBottom: "7%",
                width: ["67%", "60%", "50%"],
                padding: "5% 10% 5% 10%",
                marginLeft: "1.5%",
                marginRight: "auto",
                backgroundColor: "#FFE0FE",
                borderRadius: "10px",
                fontWeight: "bold",
                textAlign: "center",
                display: "flex",
                fontSize: ["0.9em", "1.5em", "1.8em"],
                alignItems: "center",
                border: "1px solid #ff96fc",
              }}
            >
              <img
                style={{ width: isMobile? "13%": "10%", marginRight: "5%" }}
                src={teamImg.src}
              />{" "}
              Tvoření soupisek, přehled docházky událostí
            </Box>
          </Box>
          <Box
            sx={{
              position: "relative",
              marginLeft: ["4%", "7%", "14%"],
              backgroundColor: "#F0F2F5",
            }}
          >
            <Box
              sx={{
                content: "''",
                position: "absolute",
                top: 0,
                left: "-5px",
                height: "100%",
                width: "6px",
                backgroundColor: "#B71DDE",
                borderRadius: "10px",
                "@media screen and (max-width: 768px)": {
                  width: "1px",
                  borderLeft: "5px solid #B71DDE",
                },
              }}
            ></Box>{" "}
            <Box
              sx={{
                marginTop: "7%",
                marginBottom: "7%",
                width: ["67%", "60%", "50%"],
                padding: "5% 10% 5% 10%",
                marginLeft: "1.5%",
                marginRight: "auto",
                backgroundColor: "#FFE0FE",
                borderRadius: "10px",
                fontWeight: "bold",
                textAlign: "center",
                display: "flex",
                fontSize: ["0.9em", "1.5em", "1.8em"],
                alignItems: "center",
                border: "1px solid #ff96fc",
              }}
            >
              <img
                style={{ width: "10%", marginRight: "5%" }}
                src={trainingPlanImg.src}
              />{" "}
              Tvoření tréninkových plánů
            </Box>
          </Box>
          <Box
            sx={{
              position: "relative",
              marginLeft: ["4%", "7%", "14%"],
              backgroundColor: "#F0F2F5",
            }}
          >
            <Box
              sx={{
                content: "''",
                position: "absolute",
                top: 0,
                left: "-5px",
                height: "100%",
                width: "6px",
                backgroundColor: "#B71DDE",
                borderRadius: "10px",
                "@media screen and (max-width: 768px)": {
                  width: "1px",
                  borderLeft: "5px solid #B71DDE",
                },
              }}
            ></Box>{" "}
            <Box
              sx={{
                marginTop: "8%",
                width: ["67%", "60%", "50%"],
                padding: "6% 10% 6% 10%",
                marginLeft: "1.5%",
                marginRight: "auto",
                backgroundColor: "#FFE0FE",
                borderRadius: "10px",
                fontWeight: "bold",
                textAlign: "center",
                display: "flex",
                fontSize: ["0.9em", "1.5em", "1.8em"],
                alignItems: "center",
                border: "1px solid #ff96fc",
              }}
            >
              <img
                style={{ width: isMobile? "13%": "10%", marginRight: "5%" }}
                src={listHospitalImg.src}
              />{" "}
              Zdravotní prohlídky
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AppContent;
