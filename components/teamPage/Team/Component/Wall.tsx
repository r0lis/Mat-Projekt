import React from "react";
import { Box, Typography } from "@mui/material";

type WallProps = {
  subteamId: string;
};

const Wall: React.FC<WallProps> = (subteamId) => {
  return (
    <Box>
      <Typography>Wall</Typography>
      <Typography>Subteam ID: {subteamId.subteamId}</Typography>
    </Box>
  );
};

export default Wall;
