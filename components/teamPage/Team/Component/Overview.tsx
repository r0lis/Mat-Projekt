import React from "react";
import { Box, Typography } from "@mui/material";

type OverviewProps = {
  subteamId: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Overview: React.FC<OverviewProps> = (subteamId) => {
  return (
    <Box sx={{marginLeft:"2%", marginRight:"2%"}}>
      <Typography>todo prehled</Typography>
      
    </Box>
  );
};

export default Overview;
