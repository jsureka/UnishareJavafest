package com.unishare.backend.DTO.Request;

import com.unishare.backend.model.Role;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    @NotNull
    @NotEmpty
    private String idCard;
    @NotNull
    @NotEmpty
    private String profilePicture;
    @NotNull
    @NotEmpty
    private String fullName;
    @NotNull
    @NotEmpty
    private String password;
    @NotNull
    @NotEmpty
    private String email;
    @NotNull
    @NotEmpty
    private String address;
    @NotNull
    @NotEmpty
    private String phoneNumber;
    @NotNull
    @NotEmpty
    private Double lat;
    @NotNull
    @NotEmpty
    private Double lng;
    @NotNull
    @NotEmpty
    private Long university;
    @NotNull
    @NotEmpty
    private Role role;
}
