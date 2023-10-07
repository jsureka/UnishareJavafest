package com.unishare.backend.controller;

import com.unishare.backend.DTO.SpecialResponse.ApiResponse;
import com.unishare.backend.DTO.Request.*;
import com.unishare.backend.DTO.Response.AuthenticationResponse;
import com.unishare.backend.DTO.Response.UserResponse;
import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import com.unishare.backend.repository.UserRepository;
import com.unishare.backend.service.AuthenticationService;
import com.unishare.backend.service.MailSendingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@CrossOrigin(origins = "*")
@Validated
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final MailSendingService mailSendingService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @RequestParam("idCard") MultipartFile idCard,
            @RequestParam("profilePicture") MultipartFile profilePicture,
            @RequestParam("fullName") String fullName,
            @RequestParam("password") String password,
            @RequestParam("email") String email,
            @RequestParam("address") String address,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("lat") Double lat,
            @RequestParam("lng") Double lng,
            @RequestParam("university") Long university
    ) {
        try {
            String OTP = service.generateHashedVerificationCode();
            UserResponse temp_user = service.register(idCard, profilePicture, fullName, password, email, address, phoneNumber, lat, lng, university, OTP);
            return ResponseEntity.ok(new ApiResponse<>(temp_user, null));
        }
        catch (ErrorMessageException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(service.authenticate(request), null));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }

    @PostMapping("email-verification-otp")
    public ResponseEntity<ApiResponse<String>> emailVerificationOTP(@RequestHeader("Authorization") String token) {
        try {
            service.sendEmailVerificationCode(token);
            return ResponseEntity.ok(new ApiResponse<>("Email verification code is successfully sent.", null));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping("/email-verification")
    public ResponseEntity<ApiResponse<String>> emailVerification(@RequestBody UserVerificationRequest userVerificationRequest) {
        try {
            service.emailVerification(userVerificationRequest);
            return ResponseEntity.ok(new ApiResponse<>("Email is successfully verified.", null));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping("/send-password-reset-token")
    public ResponseEntity<ApiResponse<String>> sendPasswordResetToken(@RequestBody SendEmailVerificationCodeRequest sendResetTokenRequest) {
        String resetPasswordToken = service.generateHashedVerificationCode();
        try {
            service.sendResetToken(sendResetTokenRequest, resetPasswordToken);
            return ResponseEntity.ok(new ApiResponse<>("Token has sent to your email.", null));
        } catch (ErrorMessageException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping("/password-reset")
    public ResponseEntity<ApiResponse<String>> passwordReset(@RequestBody PasswordResetRequest passwordResetRequest) {
        try {
            service.resetPassword(passwordResetRequest);
            return ResponseEntity.ok(new ApiResponse<>("Password is successfully reset.", null));
        }
            catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping("/verify-me")
    public ResponseEntity<ApiResponse<String>> verifyMe(
            @RequestHeader("Authorization") String token
    ) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(service.verifyMe(token), null));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }
}

