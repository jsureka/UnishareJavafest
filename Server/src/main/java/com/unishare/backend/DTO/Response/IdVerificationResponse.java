package com.unishare.backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IdVerificationResponse {
    private String idCardUrl;
    private String profilePictureUrl;
}
