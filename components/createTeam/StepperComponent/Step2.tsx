import React from 'react';
import TextField from '@mui/material/TextField';
import { Box, Typography } from '@mui/material';

type Step2Props = {
  teamEmail: string;
};

const Step2: React.FC<Step2Props> = ({ teamEmail }) => {
  return (
    <Box sx={{ margin: '0 auto', marginTop: 10, paddingBottom: '4em' }}>
      <Box sx={{backgroundColor: 'white', width: '60%', marginLeft: 'auto', marginRight: 'auto', padding: '5%', marginTop: '6em', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Box>
        <Typography sx={{ textAlign: 'center' }} variant="h4" gutterBottom>Nastavte práva uživatelů a nastavte účty a další infomace.</Typography>
        <Typography>{teamEmail}</Typography>
      </Box>
      
      </Box>
    </Box>
  );
};

export default Step2;
