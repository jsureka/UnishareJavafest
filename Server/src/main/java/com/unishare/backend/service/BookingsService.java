package com.unishare.backend.service;

import com.unishare.backend.DTO.Request.BookingRequest;
import com.unishare.backend.DTO.Response.BookingResponse;
import com.unishare.backend.DTO.Response.ProductResponse;
import com.unishare.backend.DTO.Response.UserResponse;
import com.unishare.backend.DTO.SpecialResponse.PageResponse;
import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import com.unishare.backend.exceptionHandlers.ProductNotFoundException;
import com.unishare.backend.exceptionHandlers.UserNotFoundException;
import com.unishare.backend.model.Booking;
import com.unishare.backend.model.BookingStatus;
import com.unishare.backend.model.Product;
import com.unishare.backend.model.User;
import com.unishare.backend.repository.BookingRepository;
import com.unishare.backend.repository.ProductRepository;
import com.unishare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Date;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingsService {

    private final BookingRepository bookingRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final ProductService productService;


    public PageResponse<List<BookingResponse>> getAllBookings(int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        PageResponse<List<BookingResponse>> pageResponse = new PageResponse<>();
        Page<Booking> bookingPage = bookingRepository.findAll(PageRequest.of(page, size));
        List<BookingResponse> bookings = bookingPage.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        pageResponse.setData(bookings);
        pageResponse.setTotalPages(bookingPage.getTotalPages());
        pageResponse.setTotalElements(bookingPage.getTotalElements());
        pageResponse.setCurrentPage(bookingPage.getNumber());
        pageResponse.setCurrentElements(bookingPage.getNumberOfElements());
        return pageResponse;
    }

    public BookingResponse getBookingById(Long id) {
        Optional<Booking> bookingOptional = bookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            return convertToResponse(bookingOptional.get());
        }
        throw new RuntimeException("Booking not found with ID: " + id);
    }

    private Product getProductById(Long id) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isPresent()) {
            return productOptional.get();
        }
        throw new RuntimeException("Product not found with ID: " + id);
    }

    public Boolean createBooking(String token, BookingRequest bookingRequest) {
        Long borrowerId = userService.getUserIdFromToken(token);
        User buser = userService.getUserByToken(token);

        if (buser.getIsBlocked() || buser.getIsVerified() == false) {
            throw new ErrorMessageException("You are not allowed to book products.");
        }

//        ProductResponse productResponse = productService.getProductById(bookingRequest.getProductId());
//        Product product = new Product();
//        product.setId(productResponse.getProductId());
//        product.setName(productResponse.getName());
//        product.setDescription(productResponse.getDescription());
//        product.setBasePrice(productResponse.getBasePrice());
//        product.setStatus(productResponse.getStatus());
//        product.setOwner(productResponse.getOwner());

        Product product = getProductById(bookingRequest.getProductId());

        User borrower = userRepository.findById(borrowerId)
                .orElseThrow(() -> new ErrorMessageException("User not found with ID: " + borrowerId));

        if (!isProductAvailable(product.getId(), bookingRequest.getRentFrom(), bookingRequest.getRentTo())) {
            throw new RuntimeException("Product is not available for the requested dates");
        }

        if (borrowerId.equals(product.getOwner().getId())) {
            throw new RuntimeException("Cannot book your own product");
        }

        Booking booking = new Booking();
        booking.setRentFrom(bookingRequest.getRentFrom());
        booking.setRentTo(bookingRequest.getRentTo());
        booking.setStatus(BookingStatus.PENDING);
        booking.setProduct(product);
        booking.setBorrower(borrower);

        booking = bookingRepository.save(booking);

        Long productOwnerId = product.getOwner().getId();
        notificationService.sendNotificationOfPendingStatus(productOwnerId, booking.getBorrower().getId(), product.getId());

        return true;
    }

    public Boolean acceptBookingRequest(Long id, String token) {
        Long ownerId = userService.getUserIdFromToken(token);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        if (booking.getProduct().getOwner().getId() != ownerId) {
            throw new RuntimeException("Not authorized to accept this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not ready to be accepted");
        }

        if (!isProductAvailable(booking.getProduct().getId(), booking.getRentFrom(), booking.getRentTo())) {
            throw new RuntimeException("Product is not available for the requested dates");
        }

        booking.setStatus(BookingStatus.ACCEPTED);
        booking = bookingRepository.save(booking);

        Long productOwnerId = booking.getProduct().getOwner().getId();
        notificationService.sendNotificationOfAcceptedStatus(productOwnerId, booking.getBorrower().getId(), booking.getProduct().getId());
        return true;
    }

    public Boolean rejectBookingRequest(Long id, String token) {
        Long ownerId = userService.getUserIdFromToken(token);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        if (booking.getProduct().getOwner().getId() != ownerId) {
            throw new RuntimeException("Not authorized to reject this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not ready to be rejected");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking = bookingRepository.save(booking);

        Long productOwnerId = booking.getProduct().getOwner().getId();
        notificationService.sendNotificationOfRejectedStatus(productOwnerId, booking.getBorrower().getId(), booking.getProduct().getId());
        return true;
    }

    public Boolean lendProduct(Long id, String token) {
        Long borrowerId = userService.getUserIdFromToken(token);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        if (booking.getBorrower().getId() != borrowerId) {
            throw new RuntimeException("Not authorized to lend this product");
        }

        if (booking.getStatus() != BookingStatus.ACCEPTED) {
            throw new RuntimeException("Booking is not ready to be lent");
        }

        booking.setStatus(BookingStatus.LENT);
        booking = bookingRepository.save(booking);

        Long productOwnerId = booking.getProduct().getOwner().getId();
        notificationService.sendNotificationOfLentStatus(productOwnerId, booking.getBorrower().getId(), booking.getProduct().getId());
        return true;
    }

    public Boolean completeBooking(Long id, String token) {
        Long ownerId = userService.getUserIdFromToken(token);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        if (booking.getProduct().getOwner().getId() != ownerId) {
            throw new RuntimeException("Not authorized to complete this booking");
        }

        if (booking.getStatus() != BookingStatus.LENT) {
            throw new RuntimeException("Booking is not ready to be completed");
        }

        booking.setStatus(BookingStatus.COMPLETED);
        booking = bookingRepository.save(booking);

        Long productOwnerId = booking.getProduct().getOwner().getId();
        notificationService.sendNotificationOfCompletedStatus(productOwnerId, booking.getBorrower().getId(), booking.getProduct().getId());
        return true;
    }

    public Boolean cancelBooking(Long id, String token) {
        Long borrowerId = userService.getUserIdFromToken(token);
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with ID: " + id));

        if (booking.getBorrower().getId() != borrowerId) {
            throw new RuntimeException("Not authorized to cancel this booking");
        }

        if (booking.getStatus() != BookingStatus.ACCEPTED && booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Booking is not ready to be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking = bookingRepository.save(booking);

        Long productOwnerId = booking.getProduct().getOwner().getId();
        notificationService.sendNotificationOfCancelledStatus(productOwnerId, booking.getBorrower().getId(), booking.getProduct().getId());
        return true;
    }

    public void deleteBooking(Long id) {
        Optional<Booking> bookingOptional = bookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            Booking booking = bookingOptional.get();
            bookingRepository.delete(booking);
        } else {
            throw new RuntimeException("Booking not found with ID: " + id);
        }
    }

    private Integer dayCount(Date rentFrom, Date rentTo) {
        return (int) ((rentTo.getTime() - rentFrom.getTime()) / (1000 * 60 * 60 * 24));
    }

    private BookingResponse convertToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setRentFrom(booking.getRentFrom());
        response.setRentTo(booking.getRentTo());
        response.setStatus(booking.getStatus().toString());
        response.setProductResponse(productService.convertToResponse(booking.getProduct(), dayCount(booking.getRentFrom(), booking.getRentTo())));
        response.setBorrower(userService.makeUserResponse(booking.getBorrower()));
        return response;
    }

//    private ProductResponse convertProductToResponse(Product product) {
//        List<Long> bookingIds = bookingRepository.findAllByProductId(product.getId()).stream()
//                .map(Booking::getId)
//                .collect(Collectors.toList());
//
//        ProductResponse response = new ProductResponse();
//        response.setProductId(product.getId());
//        response.setName(product.getName());
//        response.setDescription(product.getDescription());
//        response.setBasePrice(product.getBasePrice());
//        response.setStatus(product.getStatus());
//        response.setOwnerId(product.getOwner().getId());
//        response.setCategoryId(product.getCategory().getId());
//        response.setBookingIds(bookingIds);
//        return response;
//    }

    private List<BookingResponse> getBookingsByProductId(Long productId) {
        List<Booking> bookings = bookingRepository.findAllByProductId(productId);
        return bookings.stream().map(this::convertToResponse).collect(Collectors.toList());
    }

    private Boolean isBookedStatus(BookingStatus status) {
        return status.equals(BookingStatus.ACCEPTED) || status.equals(BookingStatus.LENT) || status.equals(BookingStatus.COMPLETED);
    }

    private Boolean isProductAvailable(Long productId, Date rentFrom, Date rentTo) {
        List<Booking> bookings = bookingRepository.findAllByProductId(productId);
        for (Booking booking : bookings) {
            if (isBookedStatus(booking.getStatus()) && booking.getRentFrom().before(rentTo) && booking.getRentTo().after(rentFrom)) {
                return false;
            }
        }
        return true;
    }

    public PageResponse<List<BookingResponse>> getAllBookingsByOwnerAndStatus(String token, String status, int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Long ownerId = userService.getUserIdFromToken(token);
        PageResponse<List<BookingResponse>> pageResponse = new PageResponse<>();
        Page<Booking> bookingPage = bookingRepository.findBookingsByStatusAndOwnerId(ownerId, BookingStatus.valueOf(status), PageRequest.of(page, size));
        List<BookingResponse> bookings = bookingPage.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        pageResponse.setData(bookings);
        pageResponse.setTotalPages(bookingPage.getTotalPages());
        pageResponse.setTotalElements(bookingPage.getTotalElements());
        pageResponse.setCurrentPage(bookingPage.getNumber());
        pageResponse.setCurrentElements(bookingPage.getNumberOfElements());
        return pageResponse;
    }

    public PageResponse<List<BookingResponse>> getAllBookingsByOwner(String token, int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Long ownerId = userService.getUserIdFromToken(token);
        PageResponse<List<BookingResponse>> pageResponse = new PageResponse<>();
        Page<Booking> bookingPage = bookingRepository.findAllByOwnerId(ownerId, PageRequest.of(page, size));
        List<BookingResponse> bookings = bookingPage.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        pageResponse.setData(bookings);
        pageResponse.setTotalPages(bookingPage.getTotalPages());
        pageResponse.setTotalElements(bookingPage.getTotalElements());
        pageResponse.setCurrentPage(bookingPage.getNumber());
        pageResponse.setCurrentElements(bookingPage.getNumberOfElements());
        return pageResponse;
    }

    public PageResponse<List<BookingResponse>> getAllBookingsByBorrowerAndStatus(String token, String status, int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Long borrowerId = userService.getUserIdFromToken(token);
        PageResponse<List<BookingResponse>> pageResponse = new PageResponse<>();
        Page<Booking> bookingPage = bookingRepository.findAllByBorrowerIdAndStatus(borrowerId, BookingStatus.valueOf(status), PageRequest.of(page, size));
        List<BookingResponse> bookings = bookingPage.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        pageResponse.setData(bookings);
        pageResponse.setTotalPages(bookingPage.getTotalPages());
        pageResponse.setTotalElements(bookingPage.getTotalElements());
        pageResponse.setCurrentPage(bookingPage.getNumber());
        pageResponse.setCurrentElements(bookingPage.getNumberOfElements());
        return pageResponse;
    }

    public PageResponse<List<BookingResponse>> getAllBookingsByBorrower(String token, int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Long borrowerId = userService.getUserIdFromToken(token);
        PageResponse<List<BookingResponse>> pageResponse = new PageResponse<>();
        Page<Booking> bookingPage = bookingRepository.findAllByBorrowerId(borrowerId, PageRequest.of(page, size));
        List<BookingResponse> bookings = bookingPage.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        pageResponse.setData(bookings);
        pageResponse.setTotalPages(bookingPage.getTotalPages());
        pageResponse.setTotalElements(bookingPage.getTotalElements());
        pageResponse.setCurrentPage(bookingPage.getNumber());
        pageResponse.setCurrentElements(bookingPage.getNumberOfElements());
        return pageResponse;
    }
}
