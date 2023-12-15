/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
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
  role: string;
};

const ContentManagement: React.FC<TeamsProps> = (teamId) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [createSubteam] = useMutation(CREATE_SUBTEAM);
  const [error, setError] = useState<string | null>(null); 

  const handleAddTeamClick = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleFormSubmit = async () => {
    try {
      // Perform your mutation here using createSubteam mutation
      // Pass teamId and name as variables to the mutation
      await createSubteam({
        variables: { teamId: teamId.teamId, inputName: name }, // Ensure teamId is a string
      });

      // Close the form after successful submission
      setShowForm(false);
      setError(null); // Clear any previous errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error : any) {
      // Handle the error and set it in the state
      setError(error.message);
    }
  };

  return (
    <Box sx={{}}>
      <Button variant="contained" onClick={handleAddTeamClick}>
        <Typography sx={{ fontWeight: "600" }}>Přidat tým</Typography>
      </Button>

      <Dialog open={showForm} onClose={handleFormClose}>
        <DialogTitle>Přidat tým</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose}>Zavřít</Button>
          <Button onClick={handleFormSubmit}>Přidat</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentManagement;
