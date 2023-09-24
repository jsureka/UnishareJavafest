package com.unishare.backend.controller;

import com.unishare.backend.DTO.ApiResponse.ApiResponse;
import com.unishare.backend.DTO.Request.UserUpdateRequest;
import com.unishare.backend.DTO.Response.UserResponse;
import com.unishare.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*", allowedHeaders = "*")


@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        try {
            List<UserResponse> users = userService.getAllUsers();
            return ResponseEntity.ok(new ApiResponse<>(users, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Integer id) {
        try {
            UserResponse user = userService.getUserById(id);
            return ResponseEntity.ok(new ApiResponse<>(user, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PutMapping("/profile-update")
    public ResponseEntity<UserResponse> profileUpdate(@RequestBody UserUpdateRequest userUpdateRequest) {
        UserResponse updatedUser = userService.userProfileUpdate(userUpdateRequest);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/block-user/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> blockUser(@PathVariable Integer id) {
        try {
            UserResponse updatedUser = userService.userBlockStatusUpdate(id, true);
            return ResponseEntity.ok(new ApiResponse<>(updatedUser, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PutMapping("/unblock-user/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> unBlockUser(@PathVariable Integer id) {
        try {
            UserResponse updatedUser = userService.userBlockStatusUpdate(id, false);
            return ResponseEntity.ok(new ApiResponse<>(updatedUser, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }
}
