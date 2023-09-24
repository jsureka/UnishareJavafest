package com.unishare.backend.controller;

import com.unishare.backend.DTO.Request.BookingsRequest;
import com.unishare.backend.DTO.Response.BookingsResponse;
import com.unishare.backend.service.BookingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")

@RestController
@RequestMapping("/api/bookings")
public class BookingsController {

    private final BookingsService bookingsService;

    @Autowired
    public BookingsController(BookingsService bookingsService) {
        this.bookingsService = bookingsService;
    }

    @GetMapping()
    public List<BookingsResponse> getAllBookings() {
        return bookingsService.getAllBookings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingsResponse> getBookingById(@PathVariable Integer id) {
        BookingsResponse booking = bookingsService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    @PostMapping()
    public ResponseEntity<BookingsResponse> createBooking(@RequestBody BookingsRequest bookingsRequest) {
        BookingsResponse createdBooking = bookingsService.createBooking(bookingsRequest);
        return ResponseEntity.ok(createdBooking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Integer id) {
        bookingsService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
