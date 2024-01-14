import { Box, Typography } from "@mui/material";
import React from "react";

type props = {
  subteamId: string;
};

const MatchAttendance: React.FC<props> = (subteamId) => {
  return (
    <Box sx={{ marginLeft: "2%", marginRight: "2%" }}>MatchAttendance
    <Typography>{subteamId.subteamId}</Typography>
    </Box>
  );
};

export default MatchAttendance;
