package com.unishare.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.awt.print.Book;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String comment;
    private Double rating;

    @OneToOne
    @JoinColumn(name = "bookingId")
    private Booking booking;

//    @ManyToOne
//    @JoinColumn(name = "reviewerId")
//    private User reviewer;


//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "reviewer_id")
//    public User reviewer;
}
