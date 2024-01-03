import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState }  from "react";
import AddMatch from "./Match/Add";

type Props = {
  teamId: string;
};

const Matchs: React.FC<Props> = (id) => {

  const [addMatch, setAddMatch] = useState(false);


  const isSmallView = window.innerWidth >= 1200;
  const isMobile = window.innerWidth <= 600;

  const closeAddMatch = () => {
    setAddMatch(false);
  };

  return (
    <Box sx={{ display: isSmallView ? "flex" : "block", marginBottom: "2em", marginRight:"2%" }}>
      <Box
        sx={{
          marginTop: "1em",
          fontSize: "Roboto",
          width: isSmallView ? "80%" : "100%",
        }}
      >
        <Box
          sx={{
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
            width: "100%",
            padding: "15px 0px 15px 0px",
            borderRadius: "15px 15px 0px 0px",
            display: "flex",
          }}
        >
          <Typography
            sx={{ marginLeft: "5%", fontSize: "1.8em", fontWeight: "600" }}
          >
            Zápasy
          </Typography>
          <Button
          variant="contained"
            onClick={() => setAddMatch(!addMatch)}
            sx={{
              marginLeft: "auto",
              display: addMatch ? "none" : "block",
            }}
          >
            Přidat
          </Button>
          <MenuIcon
            sx={{
              marginLeft: addMatch ? "auto" : "1em",
              width: "1.5em",
              height: "1.5em",
              marginRight: "5%",
              color: "#404040",
            }}
          />
        </Box>
        <Box
          sx={{
            borderTop: "2px solid black",
            backgroundColor: "#c2c3c4",
            borderRadius: "0px 0px 15px 15px",
            padding: "0.3em",

            boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.3)",
          }}
        >
          
             
        </Box>
        <Box
          sx={{
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
            width: "100%",
            padding: "26px 0px 26px 0px",
            borderRadius: "15px",
            marginTop: "1em",
            minHeight: "100vh",
          }}
        >
          {addMatch ? (
            <Box>
              <AddMatch teamId={id.teamId} closeAddMatch={closeAddMatch}  />
            </Box>
          ) : (
            <Box>
              <Typography sx={{ marginLeft: "1em" }}>Content</Typography>
            </Box>
          )}
        </Box>
      </Box>
      {isSmallView ? (
        <Box
          sx={{
            width: isSmallView ? "23%" : "100%",
            marginLeft: "2em",
            marginTop: "1em",
            display: isSmallView ? "block" : "flex",
          }}
        >
          <Box
            sx={{
              borderRadius: "15px",
              backgroundImage: `
             linear-gradient(to bottom, #c2c3c4 60px, #ffffff 60px)
             `,
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
              height: "49%",
              display: isSmallView ? "" : "block",
            }}
          >
            <Box sx={{}}>
              <Typography
                sx={{
                  fontSize: ["0.8rem", "1.1rem", "1.5rem"],
                  marginLeft: ["0.6rem", "1rem", "1rem"],
                  fontWeight: "600",
                  paddingTop: ["1.4rem", "1rem", "0.5em"],
                }}
              >
                Nadcházející zápasy
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              borderRadius: "15px",
              backgroundImage: `
             linear-gradient(to bottom, #c2c3c4 60px, #ffffff 60px)
             `,
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
              height: "48%",
              marginTop: isSmallView ? "10%" : "0%",
              
            }}
          >
            <Typography
              sx={{
                paddingTop: ["0.8rem", "1rem", "0.5em"],
                fontSize: ["0.8rem", "1.1rem", "1.5rem"],
                marginLeft: ["0.3rem", "0.6rem", "1rem"],
                fontWeight: "600",
                marginBottom: "1em",
                whiteSpace: "nowrap",
              }}
            >
              Poslední zápasy
            </Typography>
            <Box sx={{maxHeight:"22em", overflowY:"auto" }}>
           
            </Box>
             
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex", // Set display to flex
            justifyContent: "space-between", // Add space between the two boxes
            width: "100%",
            marginTop: "1em",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              flex: 1, // Make the first box take up available space
              borderRadius: "15px",
              backgroundImage: `
        linear-gradient(to bottom, #c2c3c4 60px, #ffffff 60px)
      `,
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
              height: "auto",
              display: isSmallView ? "" : "block",
            }}
          >
            <Box sx={{}}>
              <Typography
                sx={{
                  fontSize: ["0.8rem", "1.1rem", "1.5rem"],
                  marginLeft: "1rem",
                  fontWeight: "600",
                  paddingTop: ["1.4rem", "1rem", "0.5em"],
                }}
              >
                Nadcházející zápasy
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1, // Make the first box take up available space
              borderRadius: "15px",
              backgroundImage: `
        linear-gradient(to bottom, #c2c3c4 60px, #ffffff 60px)
      `,
              boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
              height: "auto",
              display: isSmallView ? "" : "block",
              marginLeft: isMobile ? "0.5em" : "2em",
            }}
          >
            <Box sx={{}}>
              <Typography
                sx={{
                  fontSize: ["0.8rem", "1.1rem", "1.5rem"],
                  marginLeft: "1rem",
                  fontWeight: "600",
                  paddingTop: ["1.4rem", "1rem", "0.5em"],
                  marginBottom: "2em",
                }}
              >
                Poslední zápasy
              </Typography>
              <Box sx={{maxHeight:"22em", overflowY:"auto" }}>
          
            </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Matchs;
