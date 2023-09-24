package com.unishare.backend.DTO.Response;

import com.unishare.backend.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingsResponse {
    private Integer id;
    private Date rentFrom;
    private Date rentTo;
    private String confirmationStatus;
    private ProductResponse productResponse;
    private UserResponse borrower;
}