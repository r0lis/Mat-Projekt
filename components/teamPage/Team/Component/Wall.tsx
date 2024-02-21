/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import Content from "../Discussion/Content";
import Add from "../Discussion/Add";

type WallProps = {
  subteamId: string;
};

const Wall: React.FC<WallProps> = (id) => {
  const [showContent, setShowContent] = useState(true);

  const handleToggleView = () => {
    setShowContent(!showContent);
  };

  const handleAddPostSuccess = () => {
    // Callback function to set showContent to true after adding a post
    setShowContent(true);
  };

  return (
    <Box sx={{ marginLeft: "4%", marginRight: "4%" }}>
      <Box sx={{ display: "flex", paddingTop: "1em" }}>
        <Typography sx={{fontWeight:"500", marginTop:"0.5em"}}>Týmová zeď</Typography>
        <Box sx={{ marginLeft: "auto" }}>
          <Button
            onClick={handleToggleView}
            variant="contained"
            color="primary"
          >
            {showContent ? "Přidat příspěvek" : "Zpět"}
          </Button>
        </Box>
      </Box>

      <Box sx={{ marginTop: "1em" }}>
        {showContent ? (
          <Content subteamId={id.subteamId} />
        ) : (
          <Add subteamId={id.subteamId as string}  
          onAddPostSuccess={handleAddPostSuccess}
          />
        )}
      </Box>
    </Box>
  );
};

export default Wall;
