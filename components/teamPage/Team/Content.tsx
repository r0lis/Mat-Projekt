import { Box,  Typography } from '@mui/material';
import React from 'react'



type TeamsProps = {
    teamId: string;
    role: string;
  };

const Content: React.FC<TeamsProps> = (id , role) => {
    console.log(id, role)
  return (
    <Box sx={{}}>
       
          <Typography sx={{ fontWeight: "600" }} >
            uelej
          </Typography>
       
      </Box>
  )
}
export default Content
