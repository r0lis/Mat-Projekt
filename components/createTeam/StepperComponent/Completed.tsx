import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import router from 'next/router';
import React, { useEffect  } from 'react';

const Completed: React.FC = () => {

  const handleButtonClick = () => {
    router.push('/');
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      router.push('/');
    }, 4000);

    return () => clearTimeout(timeoutId); // Cleanup the timeout on component unmount
  }, []); // Empty dependency array to run the effect only once

  return (
    <div>
      <Box sx={{ margin: '0 auto', marginTop: 4 }}>
        <Box
          sx={{
            backgroundColor: 'white',
            width: '60%',
            marginLeft: 'auto',
            marginRight: 'auto',
            padding: '5%',
            marginTop: '6em',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography sx={{ textAlign: 'center' }} variant="h4" gutterBottom>
            Hotovo
          </Typography>

          
            <Box sx={{ textAlign: 'center', marginTop: '2em' }}>
              <CircularProgress />
            </Box>
         
          
              <Box sx={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
                <Alert severity="success">Tým byl úspěšně vytvořen! Jste přesunuti na hlavni stranku</Alert>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleButtonClick}
                sx={{ marginTop: '2em' }}
              >
                Zpět na úvodní stránku
              </Button>
            
         
        </Box>
      </Box>
    </div>
  );
};

export default Completed;
