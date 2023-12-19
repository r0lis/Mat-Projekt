import { Box, Button, CircularProgress, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AddBoxIcon from '@mui/icons-material/AddBox';
import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";
import Attendance from "./Component/Attendance";
import Members from "./Component/Members";
import Overview from "./Component/Overview";
import Wall from "./Component/Wall";

const GET_SUBTEAM_DETAILS = gql`
  query GetSubteamDetails($subteamId: String!) {
    getSubteamDetails(subteamId: $subteamId) {
      Name
      subteamId
      teamId
      subteamMembers {
        email
        role
        position
      }
    }
  }
`;

interface ContentProps {
  subteamId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SubteamMember {
  email: string;
  role: string;
  position: string;
}

const Content: React.FC<ContentProps> = ({ subteamId }) => {
  const user = authUtils.getCurrentUser();
  const [selectedButton, setSelectedButton] = useState("overview");

  const { loading, error, data } = useQuery(GET_SUBTEAM_DETAILS, {
    variables: { subteamId },
    skip: !user,
  });

  if (loading)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  if (error) return <Typography>Chyba</Typography>;

  const subteam = data.getSubteamDetails;

  const renderContent = () => {
    switch (selectedButton) {
      case "overview":
        return <Overview subteamId={subteamId as string} />;
      case "wall":
        return <Wall subteamId={subteamId} />;
      case "attendance":
        return <Attendance subteamId={subteamId} />;
      case "members":
        return <Members subteamId={subteamId  as string} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", marginBottom: "2em" }}>
      <Box sx={{ marginTop: "1em", fontSize: "Roboto", width: "80%" }}>
        <Box
          sx={{
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
            width: "100%",
            padding: "15px 0px 15px 0px",
            borderRadius: "15px 15px 0px 0px",
            display: "flex",
          }}
        >
          <Typography sx={{ marginLeft: "5%", fontSize: "1.8em", fontWeight:"600" }}>
            {subteam.Name}
          </Typography>
          <AddBoxIcon sx={{marginLeft:"auto",  width:"1.5em", height:"1.5em", color: "#404040"}}/>
          <MenuIcon sx={{marginLeft:"1em",  width:"1.5em", height:"1.5em", marginRight:"5%", color: "#404040"}}/>
        </Box>
        <Box
          sx={{
            borderTop:"2px solid black",
            backgroundColor: "#c2c3c4",
            borderRadius: "0px 0px 15px 15px",
            padding: "0.3em",
            
            boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.3)", 
          }}
        >
          <Button
            style={{
              backgroundColor:
                selectedButton === "overview" ? "white" : "#F0F2F5",
              border: selectedButton === "overview" ? "2px solid black" : "",
              boxShadow:
                selectedButton === "overview"
                  ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                  : "0px 0px 0px rgba(0, 0, 0, 0.2)",
              marginRight: "2em",
              color: "black",
              fontFamily: "Roboto",
              marginLeft: "5%",
              marginTop: "0.5em",
              marginBottom: "0.5em",
              
            }}
            onClick={() => setSelectedButton("overview")}
          >
            Přehled
          </Button>
          <Button
            style={{
              backgroundColor: selectedButton === "wall" ? "white" : "#F0F2F5",
              border: selectedButton === "wall" ? "2px solid black" : "",
              boxShadow:
                selectedButton === "wall"
                  ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                  : "0px 0px 0px rgba(0, 0, 0, 0.2)",
              marginRight: "2em",
              color: "black",
              fontFamily: "Roboto",
              marginTop: "0.5em",
              marginBottom: "0.5em",
            }}
            onClick={() => setSelectedButton("wall")}
          >
            Nástěnka
          </Button>
          <Button
            style={{
              backgroundColor:
                selectedButton === "attendance" ? "white" : "#F0F2F5",
              border: selectedButton === "attendance" ? "2px solid black" : "",
              boxShadow:
                selectedButton === "attendance"
                  ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                  : "0px 0px 0px rgba(0, 0, 0, 0.2)",
              marginRight: "2em",
              color: "black",
              fontFamily: "Roboto",
              marginTop: "0.5em",
              marginBottom: "0.5em",
            }}
            onClick={() => setSelectedButton("attendance")}
          >
            Doházka
          </Button>
          <Button
            style={{
              backgroundColor:
                selectedButton === "members" ? "white" : "#F0F2F5",
              border: selectedButton === "members" ? "2px solid black" : "",
              boxShadow:
                selectedButton === "members"
                  ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                  : "0px 0px 0px rgba(0, 0, 0, 0.2)",
              color: "black",
              fontFamily: "Roboto",
              marginTop: "0.5em",
              marginBottom: "0.5em",
            }}
            onClick={() => setSelectedButton("members")}
          >
            Členové
          </Button>
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
          {renderContent()}
        </Box>
      </Box>
      <Box
        sx={{
          width: "23%",
          marginLeft: "2em",
          marginTop: "1em",
          minHeight: "100vh",
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
           
          }}
        >
          <Box sx={{}}>
            <Typography
              sx={{
                fontSize: "1.5em",
                marginLeft: "1em",
                fontWeight: "600",
                paddingTop: "0.5em",
              }}
            >
              Aktuality
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
            marginTop: "10%",
          }}
        >
          <Typography
            sx={{
              paddingTop: "0.5em",
              fontSize: "1.5em",
              marginLeft: "1em",
              fontWeight: "600",
            }}
          >
            Realizační tým
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Content;