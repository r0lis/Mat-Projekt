import React from 'react';
import { Box, Typography } from '@mui/material';

const Step3: React.FC = () => {
  return (
    <Box sx={{ margin: '0 auto', marginTop: 10, paddingBottom: '4em' }}>
      <Box sx={{backgroundColor: 'white', width: '60%', marginLeft: 'auto', marginRight: 'auto', padding: '5%', marginTop: '6em', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <Box>
        <Typography sx={{ textAlign: 'center' }} variant="h4" gutterBottom>Zkontrolujte údaje týmu</Typography>
      </Box>
      </Box>
    </Box>
  );
};

export default Step3;
