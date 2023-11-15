import { Alert, Box, Button, Typography } from '@mui/material'
import router from 'next/router';
import React from 'react'

const  Completed1: React.FC = () => {

    const handleButtonClick = () => {
        router.push('/');
      };


    return (
        <div>
            <Box sx={{ margin: '0 auto', marginTop: 4, }}>
                <Box sx={{ backgroundColor: 'white', width: '60%', marginLeft: 'auto', marginRight: 'auto', padding: '5%', marginTop: '6em', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                    <Typography sx={{ textAlign: 'center' }} variant="h4" gutterBottom>
                        Hotovo
                    </Typography>

                    <Box sx={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>

                        <Alert severity="success">
                            Tým byl úspěšně vytvořen!
                        </Alert>
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
    )
};

export default Completed1