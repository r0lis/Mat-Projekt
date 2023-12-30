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
    <Box sx={{width:"75%",}}>
      {editMode === false ? (
        <Box>
          <Box>
            <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
              {teamDetails.Name}
            </Typography>
          </Box>
          <Box sx={{ marginTop: "1.5em" }}>
            <Avatar
              sx={{ height: "6em", width: "6em" }}
              src={teamImage}
              alt="Team Image"
            />
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
            <Edit id={teamId.id}  />
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
