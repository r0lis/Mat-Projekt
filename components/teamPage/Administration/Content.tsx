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
    loading,
    error,
    data: dataImg,
  } = useQuery(GET_TEAM_IMG, {
    variables: { teamId: teamId.id },
  });

  if (loading)
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
  if (error) return <Typography>Chyba</Typography>;
  console.log(error);
  const teamImage = dataImg.getTeamImg;

  const handleEditClick = () => {
    setEditMode(true); // Set editMode to true
  };

  const handleBackClick = () => {
    setEditMode(false); // Set editMode to false
  };

  return (
    <Box>
    {editMode === false ? (
    <Box>
      <Box sx={{ marginTop: "1.5em" }}>
        <Avatar
          sx={{ height: "6em", width: "6em" }}
          src={teamImage}
          alt="Team Image"
        />
      </Box>
      <Box sx={{ marginTop: "1.5em" }}>
        <Button variant="contained" color="primary" onClick={handleEditClick}>
          Upravit
        </Button>
      </Box>
    </Box>
    ) : (
        <Box>
        <Button variant="contained" color="primary" onClick={handleBackClick}>
          Zpět
        </Button>
        </Box>
    )}
    </Box>
  );
};

export default Content;
