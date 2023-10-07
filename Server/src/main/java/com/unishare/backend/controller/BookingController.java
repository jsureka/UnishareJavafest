package com.unishare.backend.controller;

import com.unishare.backend.DTO.SpecialResponse.ApiResponse;
import com.unishare.backend.DTO.Request.BookingRequest;
import com.unishare.backend.DTO.Response.BookingResponse;
import com.unishare.backend.DTO.SpecialResponse.PageResponse;
import com.unishare.backend.service.BookingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingsService bookingsService;

    @Autowired
    public BookingController(BookingsService bookingsService) {
        this.bookingsService = bookingsService;
    }

    @GetMapping()
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size
    ) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookings(page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        try {
            BookingResponse booking = bookingsService.getBookingById(id);
            return ResponseEntity.ok(new ApiResponse<>(booking, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PostMapping()
    public ResponseEntity<ApiResponse<Boolean>> createBooking(@RequestHeader("Authorization") String token, @RequestBody BookingRequest bookingRequest) {
        try {
            Boolean flag = bookingsService.createBooking(token, bookingRequest);
            return ResponseEntity.ok(new ApiResponse<>(flag, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PutMapping("accept/{id}")
    public ResponseEntity<ApiResponse<Boolean>> acceptBooking(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        try {
            Boolean flag = bookingsService.acceptBookingRequest(id, token);
            return ResponseEntity.ok(new ApiResponse<>(flag, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PutMapping("reject/{id}")
    public ResponseEntity<ApiResponse<Boolean>> rejectBooking(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        try {
            Boolean flag = bookingsService.rejectBookingRequest(id, token);
            return ResponseEntity.ok(new ApiResponse<>(flag, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PutMapping("lent/{id}")
    public ResponseEntity<ApiResponse<Boolean>> lentBooking(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        try {
            Boolean flag = bookingsService.lendProduct(id, token);
            return ResponseEntity.ok(new ApiResponse<>(flag, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PutMapping("cancel/{id}")
    public ResponseEntity<ApiResponse<Boolean>> cancelBooking(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        try {
            Boolean flag = bookingsService.cancelBooking(id, token);
            return ResponseEntity.ok(new ApiResponse<>(flag, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PutMapping("complete/{id}")
    public ResponseEntity<ApiResponse<Boolean>> completeBooking(@RequestHeader("Authorization") String token, @PathVariable Long id) {
        try {
            Boolean flag = bookingsService.completeBooking(id, token);
            return ResponseEntity.ok(new ApiResponse<>(flag, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable Long id) {
        try {
            bookingsService.deleteBooking(id);
            return ResponseEntity.ok(new ApiResponse<>(null, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("owner/pending")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllPendingBookingsByOwner(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByOwnerAndStatus(token, "PENDING", page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("owner/accepted")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllAcceptedBookingsByOwner(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByOwnerAndStatus(token, "ACCEPTED", page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("owner/lent")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllLentBookingsByOwner(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByOwnerAndStatus(token, "LENT", page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("owner/completed")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllCompletedBookingsByOwner(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByOwnerAndStatus(token, "COMPLETED", page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("owner/rejected")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllRejectedBookingsByOwner(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByOwnerAndStatus(token, "REJECTED", page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("owner/cancelled")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllCancelledBookingsByOwner(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByOwnerAndStatus(token, "CANCELLED", page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("owner/all")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllBookingsByOwner(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByOwner(token, page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }

    }

    @GetMapping("borrower/pending")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllPendingBookingsByBorrower(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByBorrowerAndStatus(token, "PENDING", page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("borrower/accepted")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllAcceptedBookingsByBorrower(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByBorrowerAndStatus(token, "ACCEPTED", page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("borrower/lent")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllLentBookingsByBorrower(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByBorrowerAndStatus(token, "LENT", page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("borrower/completed")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllCompletedBookingsByBorrower(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByBorrowerAndStatus(token, "COMPLETED", page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("borrower/rejected")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllRejectedBookingsByBorrower(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByBorrowerAndStatus(token, "REJECTED", page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("borrower/cancelled")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllCancelledBookingsByBorrower(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByBorrowerAndStatus(token, "CANCELLED", page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("borrower/all")
    public ResponseEntity<ApiResponse<PageResponse<List<BookingResponse>>>> getAllBookingsByBorrower(
            @RequestHeader("Authorization") String token,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2147483647") int size) {
        try {
            PageResponse<List<BookingResponse>> bookings = bookingsService.getAllBookingsByBorrower(token, page, size);
            return ResponseEntity.ok(new ApiResponse<>(bookings, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }



}
