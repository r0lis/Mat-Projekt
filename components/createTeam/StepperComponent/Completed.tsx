import React, { useEffect, useState } from 'react';

import { Alert, Box, LinearProgress, Typography } from '@mui/material';
import { useRouter } from 'next/router';

function Completed() {
  
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 10));
    }, 1000);

    // Redirect after 10 seconds
    setTimeout(() => {
      clearInterval(interval);
       router.push('/');
    }, 10000);

    // Cleanup interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [history]);

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
            Dokončení
          </Typography>

          <Box sx={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
            <Alert severity="success">Tým byl úspěšně vytvořen!</Alert>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Completed;
