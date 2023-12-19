import { Box, Typography } from "@mui/material";
import React from "react";

const Noteam: React.FC = () => {
  return (
    <Box sx={{ marginLeft: "2%", marginRight: "2%" }}>
      <Typography variant="h6">Váš tým</Typography>
      <Box
        sx={{
          boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
          width: "70%",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "15px 0px 15px 0px",
          borderRadius: "15px",
        }}
      >
        <Typography sx={{padding:"2em", fontSize:"2em", fontWeight:"600"}} >Management klubu vás zatím nepřidal do žádného z týmů.</Typography>
      </Box>
    </Box>
  );
};

export default Noteam;
