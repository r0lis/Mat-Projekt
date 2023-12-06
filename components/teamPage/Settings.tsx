/* eslint-disable @typescript-eslint/no-explicit-any */
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const UPLOAD_IMAGE = gql`
  mutation UploadImage($imageBase64: String!, $teamId: String!) {
    uploadImage(imageBase64: $imageBase64, teamId: $teamId)
  }
`;


const SettingsComponent: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [uploadImage] = useMutation(UPLOAD_IMAGE);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // Function to handle image upload
  const handleImageUpload = async () => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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
    <div>
      <h2>Settings</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleImageUpload}>Upload Image</button>
    </div>
  );
};

export default SettingsComponent;