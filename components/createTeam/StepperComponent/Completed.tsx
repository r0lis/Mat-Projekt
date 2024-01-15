/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';

import { Alert, Box, LinearProgress, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { gql,  useQuery } from "@apollo/client";


const GET_TEAM_ID = gql`
  query GetTeamIdByEmail($teamEmail: String!) {
    getTeamIdByEmail(teamEmail: $teamEmail) {
      teamId
    }
  }
`;

type Step4Props = {
  teamEmail: string;

};

const Completed: React.FC<Step4Props> = ({teamEmail}) => {
  
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const {
    loading: teamIdLoading,
    error: teamIdError,
    data: teamIdData,
  } = useQuery(GET_TEAM_ID, {
    variables: { teamEmail },
  });
  const { teamId } = teamIdData?.getTeamIdByEmail || {};


  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 10));
    }, 2000);

    // Redirect after 10 seconds
    setTimeout(() => {
      clearInterval(interval);
      router.push(`/Team/${teamId}`);
    }, 1000);

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
            Klub byl úspěšně vytvořen!
          </Typography>

          <Box sx={{ width: '50%', marginLeft: 'auto', marginRight: 'auto' }}>
            <Box sx={{marginBottom:'1em', marginTop:'1em'}}>
            <Alert severity="info">Jste přesměrováni na vytvořený tým.</Alert>
            </Box>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default Completed;
