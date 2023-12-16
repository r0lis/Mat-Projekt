/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box,  CircularProgress,  Typography } from '@mui/material';
import React from 'react'
import { authUtils } from '@/firebase/auth.utils';
import { gql, useQuery } from '@apollo/client';

const GET_SUBTEAMS = gql`
  query GetYourSubteamData($teamId: String!, $email: String!) {
    getYourSubteamData(teamId: $teamId, email: $email) {
      Name
      subteamId
      teamId
    }
  }
`;

type TeamsProps = {
    teamId: string;
    
  };

const Content: React.FC<TeamsProps> = (teamId ) => {
  const user = authUtils.getCurrentUser();
    console.log(teamId,  user?.email)

    const {
      loading,
      error: subteamError,
      data,
     
    } = useQuery(GET_SUBTEAMS, {
      variables: { teamId: teamId.teamId, email: user?.email || "" },
    });

    if (loading )
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
    );
  if (subteamError) return <Typography>Chyba</Typography>;

  
  return (
    <Box sx={{}}>
      {data && data.getYourSubteamData && data.getYourSubteamData.length > 0 ? (
        <>
          <Typography sx={{ fontWeight: "600" }}>uelej</Typography>
          <Box ml={2}>
            {data.getYourSubteamData.map((subteam: any) => (
              <Typography variant="h6" key={subteam.subteamId}>
                {subteam.Name}
              </Typography>
            ))}
          </Box>
        </>
      ) : (
        <Typography>
          Manegement klubu vás zatím něpřidal do žádného týmu.
        </Typography>
      )}
    </Box>
  );
};
export default Content
