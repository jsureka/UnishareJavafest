package com.unishare.backend.controller;

import com.cloudinary.Api;
import com.unishare.backend.DTO.ApiResponse.ApiResponse;
import com.unishare.backend.DTO.Request.*;
import com.unishare.backend.DTO.Response.AuthenticationResponse;
import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import com.unishare.backend.model.User;
import com.unishare.backend.repository.UserRepository;
import com.unishare.backend.service.AuthenticationService;
import com.unishare.backend.service.MailSendingService;
import com.unishare.backend.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        String OTP = service.generateHashedVerificationCode();

        try {
            service.register(request, OTP);
            mailSendingService.sendOTPMail(request.getEmail(), OTP);
            return ResponseEntity.ok(new ApiResponse<>("Congratulations! Your registration has completed.", null));
        } catch (ErrorMessageException e) {
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

    @PostMapping("/verification")
    public ResponseEntity<ApiResponse<String>> userVerification(@RequestBody UserVerificationRequest userVerificationRequest) {
        try {
            service.verification(userVerificationRequest);
            return ResponseEntity.ok(new ApiResponse<>("Account is successfully verified.", null));
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping("/send-password-reset-token")
    public ResponseEntity<ApiResponse<String>> sendPasswordResetToken(@RequestBody SendResetTokenRequest sendResetTokenRequest) {
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
}

