/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box,  CircularProgress,  MenuItem,  Select,  Typography } from '@mui/material';
import React, { useState } from 'react'
import { authUtils } from '@/firebase/auth.utils';
import { gql, useQuery } from '@apollo/client';
import SubteamContent from "@/components/teamPage/Team/SubTeamContent";

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

  interface Subteam {
    subteamId: string;
    Name: string;
  }

const Content: React.FC<TeamsProps> = (teamId ) => {
  const user = authUtils.getCurrentUser();
    console.log(teamId,  user?.email)

    const {
      loading,
      error: subteamError,
      data,
     
    } = useQuery(GET_SUBTEAMS, {
      variables: { teamId: teamId.teamId, email: user?.email || "" },
      skip: !user,
    });

    const [selectedSubteam, setSelectedSubteam] = useState(
      data?.getYourSubteamData?.length > 0
        ? data.getYourSubteamData[0].subteamId
        : null
    );
    

    const handleSubteamChange = (event: { target: { value: any } }) => {
      setSelectedSubteam(event.target.value);
    };

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
          <Box ml={2} >
                    <Select
                      sx={{ width: "100%", height: "4em", marginTop: "1em" }}
                      value={selectedSubteam}
                      onChange={handleSubteamChange}
                      
                    >
                      {data.getYourSubteamData.map((subteam: Subteam) => (
                        <MenuItem
                          key={subteam.subteamId}
                          value={subteam.subteamId}
                        >
                          <Typography variant="h6">
                          {subteam.Name}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                    {data.getYourSubteamData.map((subteam: Subteam) => (
                      <div key={subteam.subteamId}>
                        {selectedSubteam === subteam.subteamId && (
                          // Content to show when this subteam is selected
                          <Typography variant="body1">
                            {/* Assuming Content component accepts subteamId */}
                            <SubteamContent subteamId={subteam.subteamId} />
                          </Typography>
                        )}
                      </div>
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
