package com.unishare.backend.service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.unishare.backend.DTO.Request.*;
import com.unishare.backend.DTO.Response.AuthenticationResponse;
import com.unishare.backend.DTO.Response.UserResponse;
import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import com.unishare.backend.model.*;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import com.unishare.backend.repository.TokenRepository;
import com.unishare.backend.repository.UniversityRepository;
import com.unishare.backend.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

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
    private final UniversityRepository universityRepository;
    private final CloudinaryImageService cloudinaryImageService;
    private final MLService mlService;

    @CacheEvict(value = {"user-#id", "user-all"}, allEntries = true)
    public UserResponse register(RegisterRequest request, String OTP) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ErrorMessageException("This email address have already an account.");
        }

        var user = User.builder()
                .fullName(request.getFullName())
                .university(universityRepository.findById(request.getUniversity()).orElse(null))
                .address(request.getAddress())
                .lat(request.getLat())
                .lng(request.getLng())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole())
                .OTP(OTP)
                .passwordResetToken(null)
                .isVerified(false)
                .isEmailVerified(false)
                .isBlocked(false)
                .build();

        var savedUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(savedUser);
        var refreshToken = jwtService.generateRefreshToken(savedUser);
        saveUserToken(savedUser, jwtToken);
        UserResponse userResponse = userService.makeUserResponse(savedUser);

        return userResponse;
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
        userEmail = jwtService.extractEmailFromBearerToken(refreshToken);
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
            SecureRandom secureRandom = new SecureRandom();
            byte[] randomBytes = new byte[CODE_LENGTH];
            secureRandom.nextBytes(randomBytes);
            String verificationCode = bytesToHex(randomBytes);

            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = messageDigest.digest(verificationCode.getBytes());

            return bytesToHex(hashedBytes).substring(0, Math.min(10, bytesToHex(hashedBytes).length()));
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

    public void emailVerification(UserVerificationRequest request) {
        User user = this.userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ErrorMessageException("Ops, Invalid email address."));
        if (user.getIsEmailVerified()) {
            throw new ErrorMessageException("Your account is already verified.");
        }

        boolean verified = user.getOTP().equals(request.getOTP());
        if (verified) {
            user.setIsEmailVerified(true);
            userRepository.save(user);
        }
        else {
            throw new ErrorMessageException("Ops, Invalid token.");
        }
    }

    public void sendResetToken(SendEmailVerificationCodeRequest request, String token) {
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


    @CacheEvict(value = {"user-#id", "user-all"}, allEntries = true)
    public UserResponse register(MultipartFile idCard, MultipartFile profilePicture, String fullName, String password, String email, String address, String phoneNumber, Double lat, Double lng, Long university, String otp) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ErrorMessageException("This email address have already an account.");
        }

        if (universityRepository.findById(university).isEmpty()) {
            throw new ErrorMessageException("University is not found.");
        }

        Role role;
        if (email.equals("bsse1113@iit.du.ac.bd")) role = Role.ADMIN;
        else                                       role = Role.USER;

        User user = User.builder()
                .idCard(this.cloudinaryImageService.getUploadedImageUrl(idCard))
                .profilePicture(this.cloudinaryImageService.getUploadedImageUrl(profilePicture))
                .fullName(fullName)
                .university(universityRepository.findById(university).orElse(null))
                .address(address)
                .lat(lat)
                .lng(lng)
                .email(email)
                .password(passwordEncoder.encode(password))
                .phoneNumber(phoneNumber)
                .role(role)
                .OTP(otp)
                .passwordResetToken(null)
                .isVerified(false)
                .isEmailVerified(false)
                .isBlocked(false)
                .build();

        var savedUser = userRepository.save(user);
        var jwtToken = jwtService.generateToken(savedUser);
        //var refreshToken = jwtService.generateRefreshToken(savedUser);
        saveUserToken(savedUser, jwtToken);

        UserResponse userResponse = userService.makeUserResponse(savedUser);
        //return AuthenticationResponse.builder().accessToken(jwtToken).refreshToken(refreshToken).build();
        return userResponse;
    }

    public void sendEmailVerificationCode(String request) {
        String email = jwtService.extractEmailFromBearerToken(request);
        User user = this.userRepository.findByEmail(email)
                .orElseThrow(() -> new ErrorMessageException("Ops, Invalid email address."));
        if (user.getIsEmailVerified()) {
            throw new ErrorMessageException("Email is already verified.");
        }

        String OTP = user.getOTP();
        mailSendingService.sendOTPMail(email, OTP);
    }

    public String verifyMe(String token) {
        User user = this.userRepository.findByEmail(jwtService.extractEmailFromBearerToken(token))
                .orElseThrow(() -> new ErrorMessageException("Ops, Invalid email address."));

        if (user.getIsVerified()) {
            return "Email is already verified.";
        }

        try {
            Optional<University> university = universityRepository.findById(user.getUniversity().getId());
            if (university.isEmpty()) {
                return "University is not found.";
            }
            String universityName = university.get().getUniversityName();
            String idCardUrl = user.getIdCard();

            ObjectMapper objectMapper = new ObjectMapper();

            String logoResponse = mlService.getLogo(idCardUrl);
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
                return "ID card is not authorized.";
            }

            String profilePictureUrl = user.getProfilePicture();
            String faceResponse = mlService.getFaceCompare(idCardUrl, profilePictureUrl);
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
                return "Sorry, Id card face and profile picture face didn't match.";
            }

            user.setIsVerified(true);
            userRepository.save(user);

            return "Successfully verified.";
        } catch (Exception e) {
            throw new ErrorMessageException("Sorry, Something went wrong.");
        }
    }
}
