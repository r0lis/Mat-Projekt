import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, gql } from '@apollo/client';
import { authUtils } from '../firebase/auth.utils';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stepper from '../components/createTeam/Stepper';


function CreateTeam() {

  return (
    <>
      <Box>
      <Stepper />
      </Box>
    </>
    
  );
}

export default CreateTeam;
