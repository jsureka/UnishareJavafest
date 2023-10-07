package com.unishare.backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse implements Serializable {
    private Long id;
    private String comment;
    private Double rating;
    private Long bookingId;
    private Long reviewerId;
}
