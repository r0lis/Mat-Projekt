import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

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
        name: '',
        location: '',
      });
      const [addHallToTeam, { loading, error }] = useMutation(ADD_GYM_TO_TEAM);

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
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
          console.error('Chyba při mutaci:', mutationError);
          // Zpracování chyby
        }
      };

  return (
    <Box>
      <Box>AddHall </Box>
        <Box>
      <TextField
          label="Název haly"
          value={hallData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'name')}
          />
      </Box>
      <Box>
        <TextField
          label="Umístění haly"
          value={hallData.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e, 'location')}
          />
      </Box>
      <Button variant="outlined" color="primary" onClick={handleAddHall} disabled={loading}>
        Přidat posilovnu
      </Button>
        <Box>{error && <Typography>{error.message}</Typography>}</Box>
      <Button variant="outlined" color="primary" onClick={onClose}>
        Zavřít
      </Button>
    </Box>
  );
};

export default AddGym;
