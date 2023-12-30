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

function convertToDateString(timestamp: string) {
  const timestampNumber = parseFloat(timestamp);

  const isMilliseconds = timestamp.length > 10;

  const date = isMilliseconds
    ? new Date(timestampNumber)
    : new Date(timestampNumber * 1000);

  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}.${month}.${year}`;
}

type Props = {
  id: string;
};

const Content: React.FC<Props> = (teamId) => {
  const [editMode, setEditMode] = useState(false);

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
  console.log(error);

  const teamDetails = dataDetails.getTeam;
  const teamImage = dataImg.getTeamImg;

  const handleEditClick = () => {
    setEditMode(true); // Set editMode to true
  };

  const handleBackClick = () => {
    setEditMode(false); // Set editMode to false
  };

  return (
    <Box
      sx={{
        width: "80%",
        boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.3)",
        padding: "3%",
        marginTop: "1em",
        marginLeft: "6%",
        marginRight: "5%",
      }}
    >
      {editMode === false ? (
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
          <Box sx={{ marginTop: "1em" }}>
            <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
              Vytvořeno
            </Typography>
            <Typography sx={{ fontFamily: "Roboto" }}>
              {convertToDateString(teamDetails.TimeCreated)}
            </Typography>
            <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
              Místo
            </Typography>
            <Typography sx={{ fontFamily: "Roboto" }}>
              {teamDetails.Place}
            </Typography>
            <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
              Email
            </Typography>
            <Typography sx={{ fontFamily: "Roboto" }}>
              {teamDetails.Email}
            </Typography>
            <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
              Majitel
            </Typography>
            <Typography sx={{ fontFamily: "Roboto" }}>
              {teamDetails.OwnerName} {teamDetails.OwnerSurname}
            </Typography>
            <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
              Email majitele
            </Typography>
            <Typography sx={{ fontFamily: "Roboto" }}>
              {teamDetails.AdminEmail}
            </Typography>
            
          </Box>

          <Box sx={{ marginTop: "1.5em" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleEditClick}
            >
              Upravit
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          <Box>
            <Edit id={teamId.id} />
          </Box>
          <Button variant="contained" color="primary" onClick={handleBackClick}>
            Zpět
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Content;
