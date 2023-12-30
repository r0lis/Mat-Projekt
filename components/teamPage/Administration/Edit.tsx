/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Input,
  InputLabel,
  Typography,
  Avatar 
} from "@mui/material";
import React, { useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

const UPLOAD_IMAGE = gql`
  mutation UploadImageTeam($imageBase64: String!, $teamEmail: String!) {
    uploadImageTeam(imageBase64: $imageBase64, teamEmail: $teamEmail)
  }
`;

const GET_TEAM_DETAILS = gql`
  query GetTeam($teamId: String!) {
    getTeam(teamId: $teamId) {
      AdminEmail
      Email
      Logo
      Name
      OwnerName
      OwnerSurname
      Place
      TimeCreated
      teamId
    }
  }
`;

type Props = {
  id: string;
};

const Edit: React.FC<Props> = (teamId ) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [, setError] = useState(null);
  const [, setImg] = useState("");
  const [uploadImage] = useMutation(UPLOAD_IMAGE);

  const {
    loading: loadingDetails,
    error: errorDetails,
    data: dataDetails,
  } = useQuery(GET_TEAM_DETAILS, {
    variables: { teamId: teamId.id },
  });

 

  if (  loadingDetails)
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
  if (errorDetails) return <Typography>Chyba</Typography>;

  const teamDetails = dataDetails.getTeam;
  const teamEmail = teamDetails.Email;

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDelete = () => {
    setSelectedImage(null);
    setImg(""); // Optional: Clear the image URL from the state
  };

  // Function to handle image upload
  const handleImageUpload = async () => {
    try {
      if (!selectedImage) {
        throw new Error("Vyberte prosím obrázek pro tým.");
      }
      try {
        const imageBase64 = selectedImage;

        console.log("Base64 image:", imageBase64);

        // Call the GraphQL mutation with the image data
        await uploadImage({
          variables: {
            imageBase64,
            teamEmail: teamEmail,
          },
        });

        console.log("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Box>
      <Box sx={{ marginTop: "1.5em" }}>
        <Typography
          sx={{ fontFamily: "Roboto", fontWeight: "600" }}
          variant="h6"
        >
          Změnit obrázek
        </Typography>

        <InputLabel htmlFor="imageInput">
          <Input
            id="imageInput"
            type="file"
            onChange={handleImageChange}
            style={{ display: "none" }}
            inputProps={{ accept: "image/*" }}
          />
        </InputLabel>
        {!selectedImage && (
          <Box sx={{ marginTop: "0.4em", marginBottom: "1em" }}>
            <label htmlFor="imageInput">
              <Button variant="contained" component="span">
                Vybrat obrázek
              </Button>
            </label>
          </Box>
        )}
        {selectedImage && (
          <Box
            sx={{
              padding: "10px",
              marginTop: "0px",
              borderRadius: "15px",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
              marginBottom: "20px",
            }}
          >
            <Box
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Card sx={{ width: 200, height: 200, marginRight: "10px" }}>
                <Avatar 
                  sx={{ width: 150, height: 150, boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)", margin: "auto", marginTop:"25px", marginBottom:"25px", objectFit: "cover" }}
                  src={selectedImage}
                  alt="Team Image"
                />
              </Card>
              <Button variant="outlined" onClick={handleImageDelete}>
                Smazat obrázek
              </Button>
            </Box>
          </Box>
        )}
        <Box sx={{ marginTop: "1.5em" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleImageUpload}
          >
            Uložit
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Edit;
