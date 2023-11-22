import React from 'react';
import Box from '@mui/material/Box';
import Stepper from '../components/createTeam/Stepper';
import { authUtils } from '@/firebase/auth.utils';

import Alert from '@mui/material/Alert';
import { Button } from '@mui/material';



const CreateTeam: React.FC = () => {

  const user = authUtils.getCurrentUser();

  const alertForLogin = (
    <Alert severity="warning">
      Pro pokračování je nutné se přihlásit.{' '}
      <Button  href="/LoginPage" color="inherit">
        Přihlásit se
      </Button>
    </Alert>
  );

  return (
    <>
      <Box>
        {user ? ( // Pokud je uživatel přihlášen, zobrazí se Stepper
          <Stepper />
        ) : (
          alertForLogin // Pokud uživatel není přihlášen, zobrazí se Alert
        )}
      </Box>
    </>
  );
};

export default CreateTeam;
