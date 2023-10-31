import React, { useState } from 'react';
import { Button, Card, Input, LinearProgress, Typography } from '@mui/material';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const UploadImageToStorage = () => {
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [downloadURL, setDownloadURL] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progressUpload, setProgressUpload] = useState<number>(0);

  const handleSelectedFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0] && files[0].size < 10000000) {
      setImageFile(files[0]);
      console.log(files[0]);
    } else {
      alert('File size too large');
    }
  };

  const handleUploadFile = () => {
    if (imageFile) {
      const name = imageFile.name;
      //const storageRef = ref(storage, `image/${name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgressUpload(progress);

          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          alert(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setDownloadURL(url);
          });
        }
      );
    } else {
      alert('File not found');
    }
  };

  const handleRemoveFile = () => setImageFile(undefined);

  return (
    <div className="container mt-5">
      <div className="col-lg-8 offset-lg-2">
        <input
          type="file"
          accept="image/png"
          onChange={handleSelectedFile}
        />

        <div className="mt-5">
          <Card>
            {imageFile && (
              <>
                <div>
                  <Typography variant="h6">{imageFile.name}</Typography>
                  <Typography variant="body2">Size: {imageFile.size}</Typography>
                </div>

                <div className="text-right mt-3">
                  <Button
                    disabled={isUploading}
                    variant="contained"
                    color="primary"
                    onClick={handleUploadFile}
                  >
                    Upload
                  </Button>

                  <LinearProgress variant="determinate" value={progressUpload} />
                </div>
              </>
            )}

            {downloadURL && (
              <>
                <img
                  src={downloadURL}
                  alt={downloadURL}
                  style={{ width: 200, height: 200, objectFit: 'cover' }}
                />
                <Typography>{downloadURL}</Typography>
              </>
            )}
            <Typography></Typography>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UploadImageToStorage;
