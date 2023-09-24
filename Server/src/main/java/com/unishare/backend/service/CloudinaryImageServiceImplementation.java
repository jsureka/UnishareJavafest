package com.unishare.backend.service;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryImageServiceImplementation implements CloudinaryImageService {
    @Autowired
    private Cloudinary cloudinary;
    @Autowired
    private MailSendingService mailSendingService;

    @Override
    public Map imageUpload(MultipartFile file) {
        try {
            return this.cloudinary.uploader().upload(file.getBytes(), Map.of());
        } catch (IOException e) {
            throw new RuntimeException("Image uploading fail!");
        }
    }
}
