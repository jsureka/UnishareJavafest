package com.unishare.backend.controller;

import com.unishare.backend.service.CloudinaryImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/api/uploads")
public class ImageUploadController {
    @Autowired
    private CloudinaryImageService cloudinaryImageService;


    @PostMapping("/image")
    public ResponseEntity<Map> uploadImageToCloudinary(@RequestParam("image")MultipartFile file) {
        try {
            Map response = this.cloudinaryImageService.imageUpload(file);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
