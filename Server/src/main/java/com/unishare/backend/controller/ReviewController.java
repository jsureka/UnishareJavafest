package com.unishare.backend.controller;

import com.unishare.backend.DTO.SpecialResponse.ApiResponse;
import com.unishare.backend.DTO.Request.ReviewRequest;
import com.unishare.backend.DTO.Response.ReviewResponse;
import com.unishare.backend.DTO.SpecialResponse.PageResponse;
import com.unishare.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<List<ReviewResponse>>>> getAllReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size
    ) {
        try {
            PageResponse<List<ReviewResponse>> reviewResponses = reviewService.getAllReviews(page, size);
            return ResponseEntity.ok(new ApiResponse<>(reviewResponses, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReviewById(@PathVariable Long id) {
        try {
            ReviewResponse reviewResponse = reviewService.getReviewById(id);
            return ResponseEntity.ok(new ApiResponse<>(reviewResponse, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(@RequestBody ReviewRequest review) {
        try {
            ReviewResponse createdReviewResponse = reviewService.createReview(review);
            return ResponseEntity.ok(new ApiResponse<>(createdReviewResponse, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ReviewResponse>> updateReview(@PathVariable Long id, @RequestBody ReviewRequest updatedReview) {
        try {
            ReviewResponse updatedReviewResponse = reviewService.updateReview(id, updatedReview);
            return updatedReviewResponse != null
                    ? ResponseEntity.ok(new ApiResponse<>(updatedReviewResponse, null))
                    : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>());
        }
    }
}
