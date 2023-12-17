import React from "react";
import { Box, Typography } from "@mui/material";

type OverviewProps = {
  subteamId: string;
};

const Overview: React.FC<OverviewProps> = (subteamId) => {
  return (
    <Box>
      <Typography>Overview</Typography>
      <Typography>Subteam ID: {subteamId.subteamId}</Typography>
    </Box>
  );
};

export default Overview;
