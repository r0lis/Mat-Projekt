/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import AddHall from "./AddHall";

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

const GET_TEAM_HALLS = gql`
query GetTeamHalls($teamId: String!) {
  getHallsByTeamId(teamId: $teamId) {
    name
    location
  }
}
`;

type Props = {
  id: string;
};

const Halls: React.FC<Props> = ({ id }) => {
  const [addHall, setAddHall] = useState(false);
  const {
    loading: loadingDetails,
    error: errorDetails,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: dataDetails,
  } = useQuery(GET_TEAM_DETAILS, {
    variables: { teamId: id },
  });

  const {
    loading: loadingHalls,
    error: errorHalls,
    data: dataHalls,
  } = useQuery(GET_TEAM_HALLS, {
    variables: { teamId: id },
  });

  if (loadingDetails || loadingHalls)
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
  if (errorDetails || errorHalls) return <Typography>Chyba</Typography>;

  const handleAddHall = () => {
    setAddHall(true);
  };

  const handleCloseAddHall = () => {
    setAddHall(false);
  };

  const halls = dataHalls?.getHallsByTeamId; 

  return (
    <Box>
      <Box>
        <Typography variant="h5">Haly</Typography>
      </Box>
      {addHall ? (
        <AddHall id={id} onClose={handleCloseAddHall} />
      ) : (
        <Box>
          {halls !== null ? (
            <Box>
              {halls.map(
                (
                  hall: { name: any; location: any },
                  index: React.Key | null | undefined
                ) => (
                  <div key={index}>
                    <Typography>{`Název: ${hall.name}, Umístění: ${hall.location}`}</Typography>
                  </div>
                )
              )}
            </Box>
          ) : (
            <Typography>Žádné haly</Typography>
          )}
          <Button variant="outlined" color="primary" onClick={handleAddHall}>
            Přidat
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Halls;
