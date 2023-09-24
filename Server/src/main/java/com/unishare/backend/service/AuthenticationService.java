package com.unishare.backend.service;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.unishare.backend.DTO.Request.*;
import com.unishare.backend.DTO.Response.AuthenticationResponse;
import com.unishare.backend.config.JwtService;
import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import com.unishare.backend.exceptionHandlers.UserNotFoundException;
import com.unishare.backend.model.Token;
import com.unishare.backend.model.TokenType;
import com.unishare.backend.model.User;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import com.unishare.backend.repository.TokenRepository;
import com.unishare.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final MailSendingService mailSendingService;
    private final UserService userService;

    public void register(RegisterRequest request, String OTP) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ErrorMessageException("This email address have already an account.");
        }

        var user = User.builder()
                .fullName(request.getFullName())
                .university(request.getUniversity())
                .idCard(request.getIdCard())
                .profilePicture(request.getProfilePicture())
                .address(request.getAddress())
                .lat(request.getLat())
                .lng(request.getLng())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .OTP(OTP)
                .passwordResetToken(null)
                .isVerified(false)
                .isBlocked(false)
                .build();

        var savedUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(savedUser);
        var refreshToken = jwtService.generateRefreshToken(savedUser);
        saveUserToken(savedUser, jwtToken);

        //return AuthenticationResponse.builder().accessToken(jwtToken).refreshToken(refreshToken).build();

    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );


        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ErrorMessageException("Ops, Invalid email address."));

        if (!user.isVerified()) {
            throw new ErrorMessageException("Your Account is not verified. Please, verify first.");
        }

        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.userRepository.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }

    public String generateHashedVerificationCode() {
        final int CODE_LENGTH = 10;

        try {
            // Generate a random verification code
            SecureRandom secureRandom = new SecureRandom();
            byte[] randomBytes = new byte[CODE_LENGTH];
            secureRandom.nextBytes(randomBytes);
            String verificationCode = bytesToHex(randomBytes);

            // Hash the verification code using SHA-256
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = messageDigest.digest(verificationCode.getBytes());

            // Convert the hashed bytes to a hexadecimal string
            return bytesToHex(hashedBytes);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }
    }

    private String bytesToHex(byte[] bytes) {
        StringBuilder hexStringBuilder = new StringBuilder();
        for (byte b : bytes) {
            hexStringBuilder.append(String.format("%02x", b));
        }
        return hexStringBuilder.toString();
    }

    public void verification(UserVerificationRequest request) {
        User user = this.userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ErrorMessageException("Ops, Invalid email address."));
        if (user.isVerified()) {
            throw new ErrorMessageException("Your account is already verified.");
        }

        boolean verified = user.getOTP().equals(request.getOTP());
        if (verified) {
            user.setVerified(true);
            userRepository.save(user);
        }
        else {
            throw new ErrorMessageException("Ops, Invalid token.");
        }
    }

    public void sendResetToken(SendResetTokenRequest request, String token) {
        User user = this.userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ErrorMessageException("Ops, Invalid email address."));

        user.setPasswordResetToken(token);
        userRepository.save(user);
        mailSendingService.sendResetTokenMail(request.getEmail(), token);
    }

    public void resetPassword(PasswordResetRequest request) {
        User user = this.userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ErrorMessageException("Ops, Invalid email address."));

        if (user.getPasswordResetToken() == null) {
            throw new ErrorMessageException("This account haven't any valid token. To get token click send token button.");
        }

        boolean matched = user.getPasswordResetToken().equals(request.getPasswordResetToken());
        if (matched) {
            user.setPasswordResetToken(null);
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
        }
        else {
            throw new ErrorMessageException("Ops, Invalid token.");
        }
    }
}
