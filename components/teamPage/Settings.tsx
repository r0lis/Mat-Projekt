/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql,  useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";


const GET_TEAM_IMG = gql`
  query GetTeamImg($teamId: String!) {
    getTeamImg(teamId: $teamId)
  }
`;

const SettingsComponent: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [, setSelectedImage] = useState<File | null>(null);

  const { loading, error, data: dataImg } = useQuery(GET_TEAM_IMG, {
    variables: {teamId: id as string, },
  });

  if (loading)
    return (
      <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        
      }}
    >
      <CircularProgress color="primary" size={50} />
    </Box>
    );
  if (error) return <Typography>Chyba</Typography>;
      console.log(error);
  const teamImage = dataImg.getTeamImg;
  console.log(teamImage);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Function to handle image upload
  const handleImageUpload = async () => {
   
  };

  return (
    <Box>
      <Box>
        <Typography
          sx={{ fontFamily: "Roboto", fontWeight: "600" }}
          variant="h4"
        >
          Settings
        </Typography>
      </Box>

      <Box sx={{ marginTop: "1.5em" }}>
      {teamImage ? (
        <img src={teamImage} alt="Team Image" />
      ) : (
        <p>No image available</p>
      )}
      </Box>

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

export default SettingsComponent;
