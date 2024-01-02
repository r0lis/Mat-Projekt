/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { gql, useQuery } from "@apollo/client";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Edit from "./Edit";
import Halls from "./Halls";
import Info from "./Info";
import Contacts from "./Contacts";

const GET_TEAM_DETAILS = gql`
  query GetTeam($teamId: String!) {
    getTeam(teamId: $teamId) {
      AdminEmail
      Email
      Logo
      Name
      OwnerName
      OwnerSurname
      Place
      TimeCreated
      teamId
    }
  }
`;

const GET_TEAM_IMG = gql`
  query GetTeamImg($teamId: String!) {
    getTeamImg(teamId: $teamId)
  }
`;
type Props = {
  id: string;
};

const Content: React.FC<Props> = (teamId) => {
  const [selectedButton, setSelectedButton] = useState("info");

  const renderContent = () => {
    switch (selectedButton) {
      case "info":
        return <Info id={teamId.id} />;
      case "hall":
        return <Halls id={teamId.id} />;
      case "contacts":
        return <Contacts id={teamId.id} />;
      case "edit":
        return <Edit id={teamId.id} />;
      default:
        return null;
    }
  };

  const {
    loading: loadingDetails,
    error: errorDetails,
    data: dataDetails,
  } = useQuery(GET_TEAM_DETAILS, {
    variables: { teamId: teamId.id },
  });

  const {
    loading,
    error,
    data: dataImg,
  } = useQuery(GET_TEAM_IMG, {
    variables: { teamId: teamId.id },
  });

  if (loading || loadingDetails)
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
        }}
      >
        <CircularProgress color="primary" size={50} />
      </Box>
    );
  if (error || errorDetails) return <Typography>Chyba</Typography>;

  const teamDetails = dataDetails.getTeam;
  const teamImage = dataImg.getTeamImg;
  const isMediumWindow = window.innerWidth < 800;

  return (
    <Box
      sx={{
        width: "80%",
        boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.3)",
        borderRadius: "10px",
        padding: "3%",
        marginTop: "1em",
        marginLeft: "6%",
        marginBottom: "2em",
        marginRight: "5%",
      }}
    >
      <Box>
        <Box sx={{ display: "flex" }}>
          <Box>
            <Typography
              sx={{
                fontFamily: "Roboto",
                fontWeight: "600",
                fontSize: "2rem",
              }}
            >
              {teamDetails.Name}
            </Typography>
          </Box>
          <Box sx={{ marginLeft: "auto", marginRight: "5%" }}>
            <Avatar
              sx={{
                height: "6em",
                width: "6em",
                boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.3)",
              }}
              src={teamImage}
              alt="Team Image"
            />
          </Box>
        </Box>
        {isMediumWindow ? (
          <Box
            sx={{
              display: "block",
              backgroundColor: "#c2c3c4",
              marginTop: "1.5em",
              paddingLeft: "2%",
              paddingRight: "2%",
              borderRadius: "10px",
              marginBottom: "0.5em",
            }}
          >
            <Box sx={{ display: "flex" }}>
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "info" ? "white" : "#F0F2F5",
                  border: selectedButton === "info" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "info"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginTop: "0.5em",
                  minWidth: "8em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("info")}
              >
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
                  Informace
                </Typography>
              </Button>
            </Box>
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "hall" ? "white" : "#F0F2F5",
                  border: selectedButton === "hall" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "hall"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  minWidth: "8em",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("hall")}
              >
                <Typography
                  sx={{
                    fontFamily: "Roboto",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                  }}
                >
                  Sportovní centra
                </Typography>
              </Button>
            </Box>
            </Box>
            <Box sx={{ display: "flex" }}>
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "contacts" ? "white" : "#F0F2F5",
                  border:
                    selectedButton === "contacts" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "contacts"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                  minWidth: "8em",
                }}
                onClick={() => setSelectedButton("contacts")}
              >
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
                  Kontakty
                </Typography>
              </Button>
            </Box>
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "edit" ? "white" : "#F0F2F5",
                  border: selectedButton === "edit" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "edit"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                  minWidth: "8em",
                }}
                onClick={() => setSelectedButton("edit")}
              >
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
                  Upravit
                </Typography>
              </Button>
            </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              backgroundColor: "#c2c3c4",
              marginTop: "1.5em",
              paddingLeft: "2%",
              paddingRight: "2%",
              borderRadius: "10px",
              marginBottom: "0.5em",
            }}
          >
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "info" ? "white" : "#F0F2F5",
                  border: selectedButton === "info" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "info"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("info")}
              >
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
                  Informace
                </Typography>
              </Button>
            </Box>
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "hall" ? "white" : "#F0F2F5",
                  border: selectedButton === "hall" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "hall"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginLeft: "5%",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("hall")}
              >
                <Typography
                  sx={{
                    fontFamily: "Roboto",
                    fontWeight: "600",
                    whiteSpace: "nowrap",
                  }}
                >
                  Sportovní centra
                </Typography>
              </Button>
            </Box>
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "contacts" ? "white" : "#F0F2F5",
                  border:
                    selectedButton === "contacts" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "contacts"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginLeft: "5%",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("contacts")}
              >
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
                  Kontakty
                </Typography>
              </Button>
            </Box>
            <Box>
              <Button
                style={{
                  backgroundColor:
                    selectedButton === "edit" ? "white" : "#F0F2F5",
                  border: selectedButton === "edit" ? "2px solid black" : "",
                  boxShadow:
                    selectedButton === "edit"
                      ? "0px 0px 8px rgba(0, 0, 0, 0.6)"
                      : "0px 0px 0px rgba(0, 0, 0, 0.2)",
                  marginRight: "2em",
                  color: "black",
                  fontFamily: "Roboto",
                  marginLeft: "5%",
                  marginTop: "0.5em",
                  marginBottom: "0.5em",
                }}
                onClick={() => setSelectedButton("edit")}
              >
                <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
                  Upravit
                </Typography>
              </Button>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            borderBottom: "3px solid gray",
            width: "100%",
            position: "relative",
            marginTop: "0.5em",
          }}
        ></Box>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Content;
