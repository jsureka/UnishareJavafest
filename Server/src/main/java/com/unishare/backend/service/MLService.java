package com.unishare.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unishare.backend.DTO.SpecialResponse.ApiResponse;
import com.unishare.backend.DTO.Request.MLServiceOneImageRequest;
import com.unishare.backend.DTO.Request.MLServiceTwoImageRequest;
import com.unishare.backend.DTO.Response.IdVerificationResponse;
import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import com.unishare.backend.service.CloudinaryImageService;
import com.unishare.backend.service.UniversityService;
import io.jsonwebtoken.io.IOException;
import lombok.RequiredArgsConstructor;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class MLService {
    String SandboxAccessKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjkwODIzMTUtOGFmNi00ODE5LWExMTMtNTE2MGM4ODVkYWY3IiwidHlwZSI6InNhbmRib3hfYXBpX3Rva2VuIn0.NIPHKmIl5NW2MBndM1ajhrv8XJ7sLSXXon1CmrEBIw0";
    String ProductionAccessKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjkwODIzMTUtOGFmNi00ODE5LWExMTMtNTE2MGM4ODVkYWY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.CfpRANr_-CX6NUY4n5bOPsQBySGnkrNOHtUuHSXqxuI";

    @Autowired
    private CloudinaryImageService cloudinaryImageService;
    @Autowired
    private UniversityService universityService;



    public String getLogo(String idCardUrl) {
        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/json");
        okhttp3.RequestBody body = okhttp3.RequestBody.create("{\"providers\":\"google\",\"file_url\":\"" + idCardUrl + "\"}", mediaType);
        Request request = new Request.Builder()
                .url("https://api.edenai.run/v2/image/logo_detection")
                .post(body)
                .addHeader("accept", "application/json")
                .addHeader("content-type", "application/json")
                .addHeader("authorization", "Bearer " + ProductionAccessKey)
                .build();

        try (Response response = client.newCall(request).execute()) {
            assert response.body() != null;
            String responseBody = response.body().string();
            System.out.println(responseBody);

            return responseBody;

        } catch (Exception e) {
            throw new ErrorMessageException("Logo detection is going wrong.");
        }
    }

    public String getFaceCompare(String idCardUrl, String profilePictureUrl) {
        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/json");
        okhttp3.RequestBody body = okhttp3.RequestBody.create("{\"file2_url\":\"" + profilePictureUrl + "\",\"file1_url\":\"" + idCardUrl + "\",\"providers\":\"facepp\"}", mediaType);
        Request request = new Request.Builder()
                .url("https://api.edenai.run/v2/image/face_compare")
                .post(body)
                .addHeader("accept", "application/json")
                .addHeader("content-type", "application/json")
                .addHeader("authorization", "Bearer " + ProductionAccessKey)
                .build();

        try (Response response = client.newCall(request).execute()) {
            assert response.body() != null;
            String responseBody = response.body().string();
            System.out.println(responseBody);

            return responseBody;

        } catch (Exception e) {
            throw new ErrorMessageException("Face comparison is going wrong.");
        }
    }
}
