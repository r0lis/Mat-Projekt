import React from "react";
import { Box, Typography } from "@mui/material";

type MembersProps = {
  subteamId: string;
};

const Members: React.FC<MembersProps> = (subteamId) => {
  return (
    <Box>
      <Typography>Members</Typography>
      <Typography>Subteam ID: {subteamId.subteamId}</Typography>
    </Box>
  );
};

export default Members;

