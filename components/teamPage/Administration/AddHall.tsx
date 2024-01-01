import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const ADD_HALL_TO_TEAM = gql`
  mutation AddHallToTeam($teamId: String!, $hall: HallInput!) {
    addHallToTeam(teamId: $teamId, hall: $hall) {
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

const AddHall: React.FC<Props> = ({ onClose, id }) => {

    const [hallData, setHallData] = useState({
        name: '',
        location: '',
      });
      const [addHallToTeam, { loading, error }] = useMutation(ADD_HALL_TO_TEAM);

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setHallData({
          ...hallData,
          [field]: e.target.value,
        });
      };
    
      const handleAddHall = async () => {
        try {
          const result = await addHallToTeam({
            variables: { teamId: id, hall: hallData },
          });
    
          // Zpracování výsledků mutace (result)
          console.log(result);
    
          // Zavřít modální okno nebo provést další kroky
          onClose();
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
        Přidat halu
      </Button>
        <Box>{error && <Typography>{error.message}</Typography>}</Box>
      <Button variant="outlined" color="primary" onClick={onClose}>
        Zavřít
      </Button>
    </Box>
  );
};

export default AddHall;
