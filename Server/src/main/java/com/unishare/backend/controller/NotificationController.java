package com.unishare.backend.controller;

import com.unishare.backend.DTO.Response.UniversityResponse;
import com.unishare.backend.DTO.SpecialResponse.ApiResponse;
import com.unishare.backend.DTO.Response.NotificationResponse;
import com.unishare.backend.DTO.SpecialResponse.PageResponse;
import com.unishare.backend.service.NotificationService;
import com.unishare.backend.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@AllArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NotificationResponse>> getNotificationById(@PathVariable Long id) {
        try {
            NotificationResponse notificationResponse = notificationService.getNotification(id);
            return ResponseEntity.ok(new ApiResponse<>(notificationResponse, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }


    @GetMapping()
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotificationByUserId(@RequestHeader("Authorization") String token) {
        try {
            Long userId = userService.getUserResponseByToken(token).getId();
            List<NotificationResponse> notificationResponses = notificationService.getNotificationsByReceiverId(userId);
            return ResponseEntity.ok(new ApiResponse<>(notificationResponses, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

}
