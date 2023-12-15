/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";

const CREATE_SUBTEAM = gql`
  mutation CreateSubteam($teamId: String!, $inputName: String!) {
    createSubteam(teamId: $teamId, inputName: $inputName) {
      Name
      subteamId
      teamId
    }
  }
`;


type TeamsProps = {
  teamId: string;
};

const ContentManagement: React.FC<TeamsProps> = (teamId) => {
  const [addMode, setAddMode] = useState(false);
  const [name, setName] = useState("");
  const [createSubteam] = useMutation(CREATE_SUBTEAM);
  const [error, setError] = useState<string | null>(null);

  const handleAddTeamClick = () => {
    setAddMode(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Perform your mutation here using createSubteam mutation
      // Pass teamId and name as variables to the mutation
      await createSubteam({
        variables: { teamId: teamId.teamId, inputName: name }, // Ensure teamId is a string
      });

      setName("");
      setAddMode(false);
      setError(null); // Clear any previous errors
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Handle the error and set it in the state
      setError(error.message);
    }
  };

  return (
    <Box sx={{}}>
      <Box>
        {!addMode && (
          <Button onClick={handleAddTeamClick} variant="contained">
            <Typography sx={{ fontWeight: "600" }}>Přidat tým</Typography>
          </Button>
        )}
      </Box>

      <Box>
        {addMode && (
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button type="submit" variant="contained">
              <Typography sx={{ fontWeight: "600" }}>Vytvořit tým</Typography>
            </Button>
            <Button onClick={() => setAddMode(false)}>Zrušit</Button>
          </form>
        )}

        {error && <Typography color="error">{error}</Typography>}
      </Box>
    </Box>
  );
};

export default ContentManagement;
