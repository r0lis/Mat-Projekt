/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";
import { gql, useQuery } from "@apollo/client";

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

type Props = {
  id: string;
};

const Info: React.FC<Props> = (teamId) => {
  const {
    loading: loadingDetails,
    error: errorDetails,
    data: dataDetails,
  } = useQuery(GET_TEAM_DETAILS, {
    variables: { teamId: teamId.id },
  });

  if (loadingDetails)
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
  if (errorDetails) return <Typography>Chyba</Typography>;

  const teamDetails = dataDetails.getTeam;


  return (
    <Box sx={{ marginTop: "1em" }}>
      <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
        Vytvořeno
      </Typography>
      <Typography sx={{ fontFamily: "Roboto" }}>
        {teamDetails.TimeCreated}
      </Typography>
      <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
        Klubový email
      </Typography>
      <Typography sx={{ fontFamily: "Roboto" }}>{teamDetails.Email}</Typography>
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
      <Typography sx={{ fontFamily: "Roboto", fontWeight: "600" }}>
        Místo
      </Typography>
      <Typography sx={{ fontFamily: "Roboto" }}>{teamDetails.Place}</Typography>
    </Box>
  );
};

export default Info;
