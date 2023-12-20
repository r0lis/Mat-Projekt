/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Box, Typography } from "@mui/material";

type AttendanceProps = {
  subteamId: string;
};

const Attendance: React.FC<AttendanceProps> = (subteamId) => {
  return (
    <Box sx={{marginLeft:"2%", marginRight:"2%"}}>
      <Typography>todo dochazka</Typography>
      
    </Box>
  );
};
export default Attendance;
