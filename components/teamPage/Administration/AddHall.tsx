import { Box, Button } from '@mui/material';
import React from 'react';

type Props = {
  onClose: () => void;
  id: string;
};

const AddHall: React.FC<Props> = ({ onClose, id }) => {
  return (
    <Box>
      <Box>AddHall {id}</Box>
      <Button variant="outlined" color="primary" onClick={onClose}>
        Zavřít
      </Button>
    </Box>
  );
};

export default AddHall;
