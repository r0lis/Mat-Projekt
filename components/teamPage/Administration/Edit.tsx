import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";

type Props = {
  id: string;
};

const Edit: React.FC<Props> = (teamId) => {
  const [, setSelectedImage] = useState<File | null>(null);
  console.log(teamId);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Function to handle image upload
  const handleImageUpload = async () => {};

  return (
    <Box>
      <Box sx={{ marginTop: "1.5em" }}>
        <Typography
          sx={{ fontFamily: "Roboto", fontWeight: "600" }}
          variant="h6"
        >
          Změnit obrázek
        </Typography>

        <input type="file" accept="image/*" onChange={handleFileChange} />
        <Button onClick={handleImageUpload}>Upload Image</Button>
      </Box>
    </Box>
  );
};

export default Edit;
