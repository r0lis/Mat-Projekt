/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import MatchAttendance from "./MatchAttendance";
import TrainingAttendance from "./TrainingAttendance";

type AttendanceProps = {
  subteamId: string;
};

const Attendance: React.FC<AttendanceProps> = ({ subteamId }) => {
  const [selectedAttendance, setSelectedAttendance] = useState<
    "training" | "match"
  >("training");

  return (
    <Box sx={{ marginLeft: "2%", marginRight: "2%", marginTop:"1.5em", paddingTop:"1.5em" }}>
      <Box sx={{marginLeft:"auto", marginRight:"auto", textAlign: "center"}}>
      <ButtonGroup>
        <Button
          variant={selectedAttendance === "training" ? "contained" : "outlined"}
          onClick={() => setSelectedAttendance("training")}
          sx={{width:"10em"}}
        >
          Treninky
        </Button>
        <Button
          variant={selectedAttendance === "match" ? "contained" : "outlined"}
          onClick={() => setSelectedAttendance("match")}
          sx={{width:"10em"}}
        >
          Zápasy
        </Button>
      </ButtonGroup>
      </Box>

      {selectedAttendance === "training" ? (
        <TrainingAttendance subteamId={subteamId} />
      ) : (
        <MatchAttendance subteamId={subteamId} />
      )}
    </Box>
  );
};
export default Attendance;