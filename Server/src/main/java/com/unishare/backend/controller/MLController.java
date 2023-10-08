package com.unishare.backend.controller;

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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/api/ML")
@RequiredArgsConstructor
public class MLController {
    String SandboxAccessKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjkwODIzMTUtOGFmNi00ODE5LWExMTMtNTE2MGM4ODVkYWY3IiwidHlwZSI6InNhbmRib3hfYXBpX3Rva2VuIn0.NIPHKmIl5NW2MBndM1ajhrv8XJ7sLSXXon1CmrEBIw0";
    String ProductionAccessKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjkwODIzMTUtOGFmNi00ODE5LWExMTMtNTE2MGM4ODVkYWY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.CfpRANr_-CX6NUY4n5bOPsQBySGnkrNOHtUuHSXqxuI";

    @Autowired
    private CloudinaryImageService cloudinaryImageService;
    @Autowired
    private UniversityService universityService;


    @PostMapping("/logo-detection")
    public String getLogoInfo(@RequestBody MLServiceOneImageRequest mlServiceOneRequest) {
        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/json");
        okhttp3.RequestBody body = okhttp3.RequestBody.create("{\"providers\":\"google\",\"file_url\":\"" + mlServiceOneRequest.getIdCard() + "\"}", mediaType);
        Request request = new Request.Builder()
                .url("https://api.edenai.run/v2/image/logo_detection")
                .post(body)
                .addHeader("accept", "application/json")
                .addHeader("content-type", "application/json")
                .addHeader("authorization", "Bearer " + SandboxAccessKey)
                .build();

        try (Response response = client.newCall(request).execute()) {
            assert response.body() != null;
            String responseBody = response.body().string();
            System.out.println(responseBody);

            return responseBody;

        } catch (IOException e) {
            e.printStackTrace();
        } catch (java.io.IOException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @PostMapping("/face-compare")
    public String getFaceCompareInfo(@RequestBody MLServiceTwoImageRequest mlServiceTwoImageRequest) {
        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/json");
        okhttp3.RequestBody body = okhttp3.RequestBody.create("{\"file2_url\":\"" + mlServiceTwoImageRequest.getProfilePicture() + "\",\"file1_url\":\"" + mlServiceTwoImageRequest.getIdCard() + "\",\"providers\":\"facepp\"}", mediaType);
        Request request = new Request.Builder()
                .url("https://api.edenai.run/v2/image/face_compare")
                .post(body)
                .addHeader("accept", "application/json")
                .addHeader("content-type", "application/json")
                .addHeader("authorization", "Bearer " + SandboxAccessKey)
                .build();

        try (Response response = client.newCall(request).execute()) {
            assert response.body() != null;
            String responseBody = response.body().string();
            System.out.println(responseBody);

            return responseBody;

        } catch (IOException e) {
            e.printStackTrace();
        } catch (java.io.IOException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    @PostMapping("/ocr")
    public String getTextInfo(@RequestBody MLServiceOneImageRequest mlServiceOneRequest) {
        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/json");
        okhttp3.RequestBody body = okhttp3.RequestBody.create("{\"providers\":\"google\",\"file_url\":\"" + mlServiceOneRequest.getIdCard() + "\"}", mediaType);
        Request request = new Request.Builder()
                .url("https://api.edenai.run/v2/ocr/ocr")
                .post(body)
                .addHeader("accept", "application/json")
                .addHeader("content-type", "application/json")
                .addHeader("authorization", "Bearer " + SandboxAccessKey)
                .build();

        try (Response response = client.newCall(request).execute()) {
            assert response.body() != null;
            String responseBody = response.body().string();
            System.out.println(responseBody);

            return responseBody;

        } catch (IOException e) {
            e.printStackTrace();
        } catch (java.io.IOException e) {
            throw new RuntimeException(e);
        }
        return null;
    }

    private String getLogo(String idCardUrl) {
        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/json");
        okhttp3.RequestBody body = okhttp3.RequestBody.create("{\"providers\":\"google\",\"file_url\":\"" + idCardUrl + "\"}", mediaType);
        Request request = new Request.Builder()
                .url("https://api.edenai.run/v2/image/logo_detection")
                .post(body)
                .addHeader("accept", "application/json")
                .addHeader("content-type", "application/json")
                .addHeader("authorization", "Bearer " + SandboxAccessKey)
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

    private String getFaceCompare(String idCardUrl, String profilePictureUrl) {
        OkHttpClient client = new OkHttpClient();

        MediaType mediaType = MediaType.parse("application/json");
        okhttp3.RequestBody body = okhttp3.RequestBody.create("{\"file2_url\":\"" + profilePictureUrl + "\",\"file1_url\":\"" + idCardUrl + "\",\"providers\":\"facepp\"}", mediaType);
        Request request = new Request.Builder()
                .url("https://api.edenai.run/v2/image/face_compare")
                .post(body)
                .addHeader("accept", "application/json")
                .addHeader("content-type", "application/json")
                .addHeader("authorization", "Bearer " + SandboxAccessKey)
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


    @PostMapping("auto-verification")
    public ResponseEntity<ApiResponse<IdVerificationResponse>> idVerification(
            @RequestParam("idCard") MultipartFile idCard,
            @RequestParam("profilePicture") MultipartFile profilePicture,
            @RequestParam("universityId") Long universityId
    ) {


        try {
            String universityName = universityService.getUniversityById(universityId).getUniversityName();
            String idCardUrl = this.cloudinaryImageService.getUploadedImageUrl(idCard);

            ObjectMapper objectMapper = new ObjectMapper();

            String logoResponse = getLogo(idCardUrl);
            JsonNode logoNode = objectMapper.readTree(logoResponse);

            JsonNode itemsNode = logoNode
                    .get("google")
                    .get("items");

            boolean universityMatched = false;

            if (itemsNode.isArray()) {
                for (JsonNode itemNode : itemsNode) {
                    String description = itemNode.get("description").asText();
                    if (description.equals(universityName)) {
                        universityMatched = true;
                        break;
                    }
                }
            }

            if (!universityMatched) {
                return ResponseEntity.badRequest().body(new ApiResponse<>(null, "ID card is not authorized."));
            }

            String profilePictureUrl = this.cloudinaryImageService.getUploadedImageUrl(profilePicture);
            String faceResponse = getFaceCompare(idCardUrl, profilePictureUrl);
            JsonNode faceNode = objectMapper.readTree(faceResponse);

            itemsNode = faceNode
                    .get("facepp")
                    .get("items");

            double maxConfidence = 0;
            if (itemsNode.isArray()) {
                for (JsonNode itemNode : itemsNode) {
                    double confidence = itemNode.get("confidence").asDouble();
                    maxConfidence = Math.max(maxConfidence, confidence);
                }
            }

            if (maxConfidence < .70) {
                return ResponseEntity.badRequest().body(new ApiResponse<>(null, "Sorry, Id card face and profile picture face didn't match."));
            }

            return ResponseEntity.ok(new ApiResponse<>(new IdVerificationResponse(idCardUrl, profilePictureUrl), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }
}
