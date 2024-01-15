import { Alert, Box, Typography } from "@mui/material";
import React from "react";

const Completed1: React.FC = () => {
  return (
    <div>
      <Box sx={{ margin: "0 auto", marginTop: 4 }}>
        <Box
          sx={{
            backgroundColor: "white",
            width: "60%",
            marginLeft: "auto",
            marginRight: "auto",
            padding: "5%",
            marginTop: "6em",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Typography sx={{ textAlign: "center" }} variant="h4" gutterBottom>
            Vytvoření Klubu:
          </Typography>

          <Box sx={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
            <Alert severity="success">Klub byl úspěšně vytvořen!</Alert>
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Completed1;
