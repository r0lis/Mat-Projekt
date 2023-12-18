import { Box, Button, CircularProgress, Typography } from "@mui/material";
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
        return <Overview subteamId={subteamId} />;
      case "wall":
        return <Wall subteamId={subteamId} />;
      case "attendance":
        return <Attendance subteamId={subteamId} />;
      case "members":
        return <Members subteamId={subteamId} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ marginTop: "1em", fontSize: "Roboto" }}>
      <Box
        sx={{
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
          width: "100%",
          padding: "15px 0px 15px 0px",
          borderRadius: "15px",
        }}
      >
        <Typography sx={{ marginLeft: "5%", fontSize: "1.8em" }}>
          {subteam.Name}
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: "1em",
          backgroundColor: "#c2c3c4",
          borderRadius: "10px",
          padding: "0.4em",
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
          }}
          onClick={() => setSelectedButton("overview")}
        >
          Přehled
        </Button>
        <Button
          style={{
            backgroundColor: selectedButton === "wall" ?  "white" : "#F0F2F5",
            border: selectedButton === "wall" ? "2px solid black" : "",
            boxShadow:
            selectedButton === "wall"
              ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
              : "0px 0px 0px rgba(0, 0, 0, 0.2)",
            marginRight: "2em",
            color: "black",
            fontFamily: "Roboto",
          }}
          onClick={() => setSelectedButton("wall")}
        >
          Nástěnka
        </Button>
        <Button
          style={{
            backgroundColor: selectedButton === "attendance" ?  "white" : "#F0F2F5",
            border: selectedButton === "attendance" ? "2px solid black" : "",
            boxShadow:
            selectedButton === "attendance"
              ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
              : "0px 0px 0px rgba(0, 0, 0, 0.2)",
            marginRight: "2em",
            color: "black",
            fontFamily: "Roboto",
          }}
          onClick={() => setSelectedButton("attendance")}
        >
          Doházka
        </Button>
        <Button
          style={{
            backgroundColor: selectedButton === "members" ?  "white" : "#F0F2F5",
            border: selectedButton === "members" ? "2px solid black" : "",
            boxShadow:
            selectedButton === "members"
              ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
              : "0px 0px 0px rgba(0, 0, 0, 0.2)",
            color: "black",
            fontFamily: "Roboto",
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
  );
};

export default Content;
