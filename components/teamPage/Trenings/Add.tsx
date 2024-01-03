import { Box, Button, Typography } from "@mui/material";
import React from "react";

type Props = {
  teamId: string;
  closeAddTraining: () => void; 
};

const AddTrening: React.FC<Props> = ({ teamId, closeAddTraining }) => {
    return (
    <Box>
      <Box>
        <Typography>Přidat trénink</Typography>
         {teamId}
         <Button variant="contained" onClick={closeAddTraining}>
          Zavřít
        </Button>
      </Box>
    </Box>
  );
};

export default AddTrening;
