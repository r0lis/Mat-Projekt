import { Box, Typography } from "@mui/material";
import React from "react";

type props = {
  subteamId: string;
};

const TrainingAttendance: React.FC<props> = (subteamId) => {
  return (
    <Box sx={{ marginLeft: "2%", marginRight: "2%" }}>
      TrainingAttendance
      <Typography>{subteamId.subteamId}</Typography>
    </Box>
  );
};

export default TrainingAttendance;
