import { Box } from "@mui/material";
import React from "react";

type ContentRousterProps = {
  idTeam: string;
  subteamId: string;
};

const ContentRouster: React.FC<ContentRousterProps> = ({
  subteamId,
  idTeam,
}) => {
  return (
    <Box>
      <Box>ContentRouster</Box>
      <Box> {subteamId}</Box>
      <Box> {idTeam}</Box>
    </Box>
  );
};

export default ContentRouster;
