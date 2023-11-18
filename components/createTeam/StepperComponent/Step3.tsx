/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Box, Button, Typography } from "@mui/material";

type Step3Props = {
  teamEmail: string;
};


const Step3: React.FC<Step3Props> = ({ teamEmail, onCompleteStep }) => {
  return (
    <Box sx={{ margin: "0 auto", marginTop: 10, paddingBottom: "4em" }}>
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
        <Box>
          <Typography sx={{ textAlign: "center" }} variant="h4" gutterBottom>
            Zkontrolujte údaje týmu
          </Typography>
        </Box>
        <Box sx={{ width: "50%", marginLeft: "auto", marginRight: "auto" }}>
          <Typography sx={{ textAlign: "center" }} variant="h6" gutterBottom>
            email teamu: {teamEmail}
          </Typography>
        </Box>
        <Button
          sx={{
            backgroundColor: "rgb(255, 224, 254)",
            padding: "1em",
            border: "1px solid rgb(255, 150, 252)",
            marginLeft: "2em", // Adjust the margin as needed
            marginRight: "auto",
            width: "14em",
          }}
          onClick={onCompleteStep}
        >
          <Typography sx={{ fontWeight: "bold", color: "black" }}>
            Dokončit
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default Step3;
