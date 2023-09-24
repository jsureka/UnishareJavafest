package com.unishare.backend.service;

import com.unishare.backend.DTO.Request.UserUpdateRequest;
import com.unishare.backend.DTO.Response.UserResponse;
import com.unishare.backend.exceptionHandlers.UserNotFoundException;
import com.unishare.backend.model.User;
import com.unishare.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponse makeUserResponse(User user) {
        return new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getProfilePicture(), user.isVerified(), user.isBlocked());
    }
    public List<UserResponse> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::makeUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));
        return makeUserResponse(user);
    }

    public UserResponse userProfileUpdate(UserUpdateRequest userUpdateRequest) {
        User user = userRepository.findByEmail(userUpdateRequest.getEmail())
                .orElseThrow(() -> new UserNotFoundException("Haven't any account with this email"));

        user.setFullName(userUpdateRequest.getFullName());
        user.setProfilePicture(userUpdateRequest.getProfilePicture());
        user = userRepository.save(user);

        return makeUserResponse(user);
    }

    public UserResponse userBlockStatusUpdate(Integer id, boolean isBlocked) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));

        user.setBlocked(isBlocked);
        user = userRepository.save(user);

        return makeUserResponse(user);
    }

    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + id));

        userRepository.delete(user);
    }

    // Add more service methods here as needed
}
