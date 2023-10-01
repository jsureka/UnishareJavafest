import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Card, CardMedia, IconButton, Input } from "@mui/material";

const ImageUpload = ({ label, onImageChange, currentImage }) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    onImageChange(file);
  };

  return (
    <div>
      {currentImage ? (
        // Display the image preview
        <div className="flex justify-center ">
          {typeof currentImage !== 'string' ? (
            <Card sx={{ maxWidth: 250, maxHeight: 150 }}>
              <CardMedia
                component="img"
                alt={`${label} Preview`}
                height="140"
                image={URL.createObjectURL(currentImage)}
              />
            </Card>
          ) : (
            <Card sx={{ maxWidth: 250, maxHeight: 150 }}>
              <CardMedia
                component="img"
                alt={`${label} Preview`}
                height="140"
                image={currentImage}
              />
            </Card>
          )}
        </div>
      ) : (
        // Display the default image
        <div className="flex justify-center ">
          <Card sx={{ maxWidth: 250 }} className=" ">
            <CardMedia
              component="img"
              alt={`${label} Preview`}
              height="100"
              image="https://via.placeholder.com/150"
            />
          </Card>
        </div>
      )}
      <div className=" text-center">
        <label htmlFor={`upload${label}`}>Upload {label} </label>
        <Input
          accept="image/*"
          id={`upload${label}`}
          type="file"
          style={{ display: "none" }}
          onChange={handleImageUpload}
          required
        />
        <label htmlFor={`upload${label}`}>
          <IconButton
            color="primary"
            aria-label={`upload ${label}`}
            component="span"
          >
            <PhotoCameraIcon className=" text-black" />
          </IconButton>
        </label>
      </div>
    </div>
  );
};

export default ImageUpload;
