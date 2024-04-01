import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";

const ADD_TRENING_HALL_TO_TEAM = gql`
  mutation AddTreningHallToTeam(
    $teamId: String!
    $treningHall: TreningHallInput!
  ) {
    addTreningHallToTeam(teamId: $teamId, treningHall: $treningHall) {
      # Include the fields you want to retrieve in the response
      # For example, if you want to get the updated team data, add the desired fields
      Name
      Logo
    }
  }
`;

type Props = {
  onClose: () => void;
  id: string;
};

const AddTreningHall: React.FC<Props> = ({ onClose, id }) => {
  const [hallData, setHallData] = useState({
    name: "",
    location: "",
  });
  const [addHallToTeam, { loading, error }] = useMutation(
    ADD_TRENING_HALL_TO_TEAM
  );

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
        variables: { teamId: id, treningHall: hallData },
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
          Přidat tréninkovou halu
        </Typography>
      </Box>
      <Box sx={{}}>
        <Box>
          <TextField
            label="Název haly"
            value={hallData.name}
            sx={{ width: "100%", boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)" }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "name")
            }
          />
        </Box>
        <Box sx={{ marginTop: "0.5em" }}>
          <TextField
            label="Umístění haly"
            value={hallData.location}
            sx={{ width: "100%", boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)" }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "location")
            }
          />
        </Box>
      </Box>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleAddHall}
        sx={{ marginTop: "1em" }}
        disabled={loading}
      >
        Přidat halu
      </Button>
      <Box>{error && <Typography>{error.message}</Typography>}</Box>
      <Button
        variant="outlined"
        color="primary"
        sx={{ marginTop: "0.5em" }}
        onClick={onClose}
      >
        Zavřít
      </Button>
    </Box>
  );
};

export default AddTreningHall;
