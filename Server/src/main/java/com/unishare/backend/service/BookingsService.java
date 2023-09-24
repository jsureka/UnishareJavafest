package com.unishare.backend.service;

import com.unishare.backend.DTO.Request.BookingsRequest;
import com.unishare.backend.DTO.Response.BookingsResponse;
import com.unishare.backend.DTO.Response.ProductResponse;
import com.unishare.backend.DTO.Response.UserResponse;
import com.unishare.backend.exceptionHandlers.ProductNotFoundException;
import com.unishare.backend.exceptionHandlers.UserNotFoundException;
import com.unishare.backend.model.Bookings;
import com.unishare.backend.model.Product;
import com.unishare.backend.model.User;
import com.unishare.backend.repository.BookingsRepository;
import com.unishare.backend.repository.ProductRepository;
import com.unishare.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BookingsService {

    private final BookingsRepository bookingsRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Autowired
    public BookingsService(BookingsRepository bookingsRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.bookingsRepository = bookingsRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<BookingsResponse> getAllBookings() {
        List<Bookings> bookings = bookingsRepository.findAll();
        return bookings.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    public BookingsResponse getBookingById(Integer id) {
        Optional<Bookings> bookingOptional = bookingsRepository.findById(id);
        if (bookingOptional.isPresent()) {
            return convertToResponse(bookingOptional.get());
        }
        throw new RuntimeException("Booking not found with ID: " + id);
    }

    public BookingsResponse createBooking(BookingsRequest bookingsRequest) {
        Bookings booking = new Bookings();
        booking.setRentFrom(bookingsRequest.getRentFrom());
        booking.setRentTo(bookingsRequest.getRentTo());
        booking.setConfirmationStatus(bookingsRequest.getConfirmationStatus());

        Product product = productRepository.findById(bookingsRequest.getProductId())
                .orElseThrow(() -> new ProductNotFoundException("Product not found with ID: " + bookingsRequest.getProductId()));
        booking.setProduct(product);

        User borrower = userRepository.findById(bookingsRequest.getBorrowerId())
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + bookingsRequest.getBorrowerId()));
        booking.setBorrower(borrower);

        booking = bookingsRepository.save(booking);
        return convertToResponse(booking);
    }

    public void deleteBooking(Integer id) {
        Optional<Bookings> bookingOptional = bookingsRepository.findById(id);
        if (bookingOptional.isPresent()) {
            Bookings booking = bookingOptional.get();
            bookingsRepository.delete(booking);
        } else {
            throw new RuntimeException("Booking not found with ID: " + id);
        }
    }

    private BookingsResponse convertToResponse(Bookings booking) {
        BookingsResponse response = new BookingsResponse();
        response.setId(booking.getId());
        response.setRentFrom(booking.getRentFrom());
        response.setRentTo(booking.getRentTo());
        response.setConfirmationStatus(booking.getConfirmationStatus());
        response.setProductResponse(convertProductToResponse(booking.getProduct()));
        response.setBorrower(new UserResponse(booking.getBorrower().getId(), booking.getBorrower().getFullName(), booking.getBorrower().getEmail(), booking.getBorrower().getProfilePicture(), booking.getBorrower().isVerified(), booking.getBorrower().isBlocked()));
        return response;
    }

    private ProductResponse convertProductToResponse(Product product) {
        List<Integer> bookingIds = product.getBookings().stream()
                .map(Bookings::getId)
                .collect(Collectors.toList());

        ProductResponse response = new ProductResponse();
        response.setProductId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setBaseprice(product.getBaseprice());
        response.setStatus(product.getStatus());
        response.setOwnerId(product.getOwner().getId());
        response.setCategoryId(product.getCategory().getId());
        response.setBookingIds(bookingIds);
        return response;
    }

}
