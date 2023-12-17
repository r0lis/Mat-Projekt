import React from "react";
import { Box, Typography } from "@mui/material";

type AttendanceProps = {
  subteamId: string;
};

const Attendance: React.FC<AttendanceProps> = (subteamId) => {
  return (
    <Box>
      <Typography>Dochazka</Typography>
      <Typography>Subteam ID: {subteamId.subteamId}</Typography>
    </Box>
  );
};
export default Attendance;
