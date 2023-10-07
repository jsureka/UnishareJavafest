package com.unishare.backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse implements Serializable {
    private Long id;
    private Date rentFrom;
    private Date rentTo;
    private String status;
    private ProductResponse productResponse;
    private UserResponse borrower;
}