/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box,  Typography } from "@mui/material";
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
          sx={{ fontFamily: "Roboto", fontWeight: "600" }}
          variant="h4"
        >
          Správa týmu
        </Typography>
      </Box>

      <Box sx={{ }}>
      <Content id={id as string} />
      </Box>
    </Box>
  );
};

export default SettingsComponent;
