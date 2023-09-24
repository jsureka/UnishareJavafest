package com.unishare.backend.DTO.Request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingsRequest {
    private Date rentFrom;
    private Date rentTo;
    private String confirmationStatus;
    private Integer productId;
    private Integer borrowerId;

}
