import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

const ADD_GYM_TO_TEAM = gql`
  mutation AddGymToTeam($teamId: String!, $gym: GymInput!) {
    addGymToTeam(teamId: $teamId, gym: $gym) {
      Name
      Logo
    }
  }
`;

type Props = {
  onClose: () => void;
  id: string;
};

const AddGym: React.FC<Props> = ({ onClose, id }) => {
  const [hallData, setHallData] = useState({
    name: "",
    location: "",
  });
  const [addHallToTeam, { loading, error }] = useMutation(ADD_GYM_TO_TEAM);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setHallData({
      ...hallData,
      [field]: e.target.value,
    });
  };

  const handleAddHall = async () => {
    try {
      const result = await addHallToTeam({
        variables: { teamId: id, gym: hallData },
      });

      // Zpracování výsledků mutace (result)
      console.log(result);

      // Zavřít modální okno nebo provést další kroky
      onClose();
      window.location.reload();
    } catch (mutationError) {
      console.error("Chyba při mutaci:", mutationError);
      // Zpracování chyby
    }
  };

  return (
    <Box sx={{ marginLeft: "3%" }}>
      <Box>
        <Typography
          sx={{ fontSize: "1.2em", fontWeight: "500", marginTop: "1em" }}
        >
          Přidat posilovnu
        </Typography>
      </Box>
      <Box sx={{}}>
        <Box>
          <TextField
            label="Název posilovny"
            value={hallData.name}
            sx={{ width: "100%", boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)" }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "name")
            }
          />
        </Box>
        <Box sx={{ marginTop: "0.5em" }}>
          <TextField
            label="Umístění posilovny"
            value={hallData.location}
            sx={{ width: "100%", boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)" }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "location")
            }
          />
        </Box>
      </Box>
      <Button
        sx={{ marginTop: "1em" }}
        variant="outlined"
        color="primary"
        onClick={handleAddHall}
        disabled={loading}
      >
        Přidat posilovnu
      </Button>
      <Box>{error && <Typography>{error.message}</Typography>}</Box>
      <Button
        sx={{ marginTop: "0.5em" }}
        variant="outlined"
        color="primary"
        onClick={onClose}
      >
        Zavřít
      </Button>
    </Box>
  );
};

export default AddGym;
