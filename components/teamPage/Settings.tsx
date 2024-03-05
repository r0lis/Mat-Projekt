/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import Content from "@/components/teamPage/Administration/Content";

const SettingsComponent: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Box>
      <Box>
        <Typography
          sx={{
            fontFamily: "Roboto",
            fontWeight: "500",
            marginTop: "0em",
            marginLeft: "2.5em",
          }}
          variant="h4"
        >
          Správa klubu
        </Typography>
      </Box>
      <Box>
        <Content id={id as string} />
      </Box>
    </Box>
  );
};

export default SettingsComponent;
