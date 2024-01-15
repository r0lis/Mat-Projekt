/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Box, Avatar, Button, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";

interface UploadImageResponse {
  uploadImageUser: string;
}

const UPLOAD_IMAGE_USER = gql`
  mutation UploadImageUser($imageBase64: String!, $userEmail: String!) {
    uploadImageUser(imageBase64: $imageBase64, userEmail: $userEmail)
  }
`;

const PhotoProvider: React.FC = () => {
  const currentUserEmail = authUtils.getCurrentUser()?.email || "";
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [uploadImage, { loading }] = useMutation<UploadImageResponse>(
    UPLOAD_IMAGE_USER
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);

      // Display image preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
    }
  };

  const handleImageUpload = async () => {
    if (selectedImage) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onloadend = () => {
          const imageBase64 = reader.result as string;

          // Call the GraphQL mutation with the image data
          uploadImage({
            variables: {
              imageBase64,
              userEmail: currentUserEmail,
            },
          })
            .then((response) => {
              // Handle success, e.g., show a success message or update UI
              console.log("Image uploaded successfully:", response.data);
              window.location.reload();
              
            })
            .catch((error) => {
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
      {loading && <CircularProgress size={20} />}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {imagePreview && (
        <Avatar
          alt="Selected Image"
          src={imagePreview}
          sx={{ width: 100, height: 100, marginTop: 1 }}
        />
      )}
      <Button
        onClick={handleImageUpload}
        disabled={!selectedImage || loading}
        variant="contained"
        color="primary"
        sx={{ marginTop: 1 }}
      >
        Upload Image
      </Button>
    </Box>
  );
};

export default PhotoProvider;
