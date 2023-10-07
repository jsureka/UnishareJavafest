package com.unishare.backend.service;

import com.unishare.backend.DTO.Request.ReviewRequest;
import com.unishare.backend.DTO.Response.ReviewResponse;
import com.unishare.backend.DTO.SpecialResponse.PageResponse;
import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import com.unishare.backend.model.Booking;
import com.unishare.backend.model.Review;
import com.unishare.backend.model.User;
import com.unishare.backend.repository.BookingRepository;
import com.unishare.backend.repository.ReviewRepository;
import com.unishare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, BookingRepository bookingRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }


    public ReviewResponse makeReviewResponse(Review review) {
        return new ReviewResponse(review.getId(), review.getComment(), review.getRating(), review.getBooking().getId(), review.getBooking().getProduct().getOwner().getId());
    }

    @Cacheable("review-all")
    public PageResponse<List<ReviewResponse>> getAllReviews(int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Page<Review> reviewPage = reviewRepository.getReviewsPage(PageRequest.of(page, size));

        PageResponse<List<ReviewResponse>> pageResponse = new PageResponse<>();
        List<ReviewResponse> reviews = reviewPage.stream()
                .map(this::makeReviewResponse)
                .collect(Collectors.toList());
        pageResponse.setData(reviews);
        pageResponse.setTotalPages(reviewPage.getTotalPages());
        pageResponse.setTotalElements(reviewPage.getTotalElements());
        pageResponse.setCurrentPage(reviewPage.getNumber());
        pageResponse.setCurrentElements(reviewPage.getNumberOfElements());
        return pageResponse;
    }

    @Cacheable("review-#id")
    public ReviewResponse getReviewById(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ErrorMessageException("Review is not found with ID: " + id));
        return makeReviewResponse(review);
    }

    @CacheEvict(value = {"review-all", "review-#id"}, allEntries = true)
    public ReviewResponse createReview(ReviewRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ErrorMessageException("Booking is not found with ID: " + request.getBookingId()));

        Review review = new Review();
        review.setComment(request.getComment());
        review.setRating(request.getRating());
        review.setBooking(booking);


        review = reviewRepository.save(review);
        booking.setReview(review);
        bookingRepository.save(booking);

        return makeReviewResponse(review);
    }

    public ReviewResponse updateReview(Long id, ReviewRequest updatedReview) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ErrorMessageException("Review is not found with ID: " + id));

        review.setComment(updatedReview.getComment());
        review.setRating(updatedReview.getRating());

        review = reviewRepository.save(review);
        return makeReviewResponse(review);
    }

    @CacheEvict(value = {"review-#id", "review-all"}, allEntries = true)
    public void deleteReview(Long id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ErrorMessageException("Review not found with ID: " + id));

        reviewRepository.delete(review);
    }
}
