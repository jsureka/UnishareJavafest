package com.unishare.backend.controller;

import com.unishare.backend.DTO.Request.MLServiceOneImageRequest;
import com.unishare.backend.DTO.Request.MLServiceTwoImageRequest;
import io.jsonwebtoken.io.IOException;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/api/ML")
public class MLController {
    String SandboxAccessKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjkwODIzMTUtOGFmNi00ODE5LWExMTMtNTE2MGM4ODVkYWY3IiwidHlwZSI6InNhbmRib3hfYXBpX3Rva2VuIn0.NIPHKmIl5NW2MBndM1ajhrv8XJ7sLSXXon1CmrEBIw0";
    String ProductionAccessKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZjkwODIzMTUtOGFmNi00ODE5LWExMTMtNTE2MGM4ODVkYWY3IiwidHlwZSI6ImFwaV90b2tlbiJ9.CfpRANr_-CX6NUY4n5bOPsQBySGnkrNOHtUuHSXqxuI";

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
}
