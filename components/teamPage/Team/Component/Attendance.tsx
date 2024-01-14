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
    <Box sx={{ marginLeft: "2%", marginRight: "2%" }}>
      <ButtonGroup>
        <Button
          variant={selectedAttendance === "training" ? "contained" : "outlined"}
          onClick={() => setSelectedAttendance("training")}
        >
          Treninky
        </Button>
        <Button
          variant={selectedAttendance === "match" ? "contained" : "outlined"}
          onClick={() => setSelectedAttendance("match")}
        >
          Zápasy
        </Button>
      </ButtonGroup>

      {selectedAttendance === "training" ? (
        <TrainingAttendance subteamId={subteamId} />
      ) : (
        <MatchAttendance subteamId={subteamId} />
      )}
    </Box>
  );
};
export default Attendance;