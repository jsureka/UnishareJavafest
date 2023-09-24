import React, { useState } from 'react';
import { Input, IconButton, Card, CardMedia } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

const ImageUpload = ({ label, onImageChange, currentImage }) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    onImageChange(file);
  };

  return (
    <div>
      {currentImage ? (
        // Display the image preview
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt={`${label} Preview`}
            height="140"
            image={URL.createObjectURL(currentImage)}
          />
        </Card>
      ) : (
        // Display the upload button
        <>
          <label htmlFor={`upload${label}`}>
            Upload {label} (Required)
          </label>
          <Input
            accept="image/*"
            id={`upload${label}`}
            type="file"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
            required
          />
          <label htmlFor={`upload${label}`}>
            <IconButton
              color="primary"
              aria-label={`upload ${label}`}
              component="span"
            >
              <PhotoCameraIcon />
            </IconButton>
          </label>
        </>
      )}
    </div>
  );
};

export default ImageUpload;
