package com.unishare.backend.service;

import com.cloudinary.Cloudinary;
import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryImageService {
    private Cloudinary cloudinary;
    private MailSendingService mailSendingService;

    @Autowired
    public CloudinaryImageService(Cloudinary cloudinary, MailSendingService mailSendingService) {
        this.cloudinary = cloudinary;
        this.mailSendingService = mailSendingService;
    }

    public Map imageUpload(MultipartFile file) {
        try {
            return this.cloudinary.uploader().upload(file.getBytes(), Map.of());
        } catch (IOException e) {
            throw new RuntimeException("Ops, image didn't upload!");
        }
    }

    public String getUploadedImageUrl(MultipartFile file) {
        try {
            return imageUpload(file).get("secure_url").toString();
        } catch (Exception e) {
            throw new ErrorMessageException(e.getMessage());
        }
    }
}
