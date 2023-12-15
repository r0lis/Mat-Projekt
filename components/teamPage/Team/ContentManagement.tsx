import { Box, Button, Typography } from '@mui/material';
import React from 'react'



type TeamsProps = {
    teamId: string;
    role: string;
  };

const ContentManagement: React.FC<TeamsProps> = (id , role) => {
    console.log(id, role)
  return (
    <Box sx={{}}>
        <Button variant="contained">
          <Typography sx={{ fontWeight: "600" }} >
            Přidat tým
          </Typography>
        </Button>
      </Box>
  )
}

export default ContentManagement