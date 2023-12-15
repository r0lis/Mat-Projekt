/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql, useMutation, useQuery } from "@apollo/client";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

const UPLOAD_IMAGE = gql`
  mutation UploadImage($imageBase64: String!, $teamId: String!) {
    uploadImage(imageBase64: $imageBase64, teamId: $teamId)
  }
`;

const GET_TEAM_IMG = gql`
  query GetTeamImg($teamId: String!) {
    getTeamImg(teamId: $teamId)
  }
`;

const SettingsComponent: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const { loading, error, data: dataImg } = useQuery(GET_TEAM_IMG, {
    variables: {teamId: id as string, },
  });

  if (loading)
    return (
      <CircularProgress
        color="primary"
        size={50}
        style={{ position: "absolute", top: "50%", left: "50%" }}
      />
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
    if (selectedImage) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onloadend = () => {
          const imageBase64 = reader.result as string;

          console.log("Base64 image:", imageBase64);

          // Call the GraphQL mutation with the image data
          uploadImage({
            variables: {
              imageBase64,
              teamId: id as string,
            },
          })
            .then((response: any) => {
              // Handle success, e.g., show a success message or update UI
              console.log("Image uploaded successfully:", response);
            })
            .catch((error: any) => {
              // Handle error, e.g., show an error message or log the error
              console.error("Error uploading image:", error);
            });
        };
      } catch (error) {
        console.error("Error processing image:", error);
      }
    }
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
