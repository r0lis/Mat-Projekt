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

type Props = {
  id: string;
};

const Halls: React.FC<Props> = ({ id }) => {
  const [addHall, setAddHall] = useState(false);
  const {
    loading: loadingDetails,
    error: errorDetails,
    data: dataDetails,
  } = useQuery(GET_TEAM_DETAILS, {
    variables: { teamId: id },
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

  const handleAddHall = () => {
    setAddHall(true);
  };

  const handleCloseAddHall = () => {
    setAddHall(false);
  };

  const teamDetails = dataDetails.getTeam;
  console.log(teamDetails.Name);

  return (
    <Box>
      <Box>
        <Typography variant="h5">Haly</Typography>
      </Box>
      {addHall ? (
        <AddHall id={id} onClose={handleCloseAddHall} />
      ) : (
        <Box>
          <Button variant="outlined" color="primary" onClick={handleAddHall}>
            Přidat
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Halls;
