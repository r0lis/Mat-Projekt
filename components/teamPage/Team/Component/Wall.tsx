/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Box, Typography } from "@mui/material";

type WallProps = {
  subteamId: string;
};

const Wall: React.FC<WallProps> = (subteamId) => {
  return (
    <Box sx={{marginLeft:"2%", marginRight:"2%"}}>
      <Typography>todo nastenka</Typography>
      
    </Box>
  );
};

export default Wall;
