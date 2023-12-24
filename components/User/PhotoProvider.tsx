/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from "@mui/material";
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { authUtils } from "@/firebase/auth.utils";

const UPLOAD_IMAGE_USER = gql`
  mutation UploadImageUser($imageBase64: String!, $userEmail: String!) {
    uploadImageUser(imageBase64: $imageBase64, userEmail: $userEmail)
  }
`;

const PhotoProvider: React.FC = () => {
  const currentUserEmail = authUtils.getCurrentUser()?.email || "";
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [uploadImage] = useMutation(UPLOAD_IMAGE_USER);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

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
              userEmail: currentUserEmail,
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
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleImageUpload}>Upload Image</button>
    </Box>
  );
};

export default PhotoProvider;
