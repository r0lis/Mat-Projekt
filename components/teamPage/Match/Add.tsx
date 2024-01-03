import { Box, Button, Typography } from "@mui/material";
import React from "react";

type Props = {
  teamId: string;
  closeAddMatch: () => void; 
};

const AddMatch: React.FC<Props> = ({ teamId, closeAddMatch }) => {
    return (
    <Box>
      <Box>
        <Typography>Přidat trénink</Typography>
         {teamId}
         <Button variant="contained" onClick={closeAddMatch}>
          Zavřít
        </Button>
      </Box>
    </Box>
  );
};

export default AddMatch;
