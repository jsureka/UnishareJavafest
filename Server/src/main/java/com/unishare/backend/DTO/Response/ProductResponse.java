package com.unishare.backend.DTO.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse implements Serializable {
    private Long productId;
    private String name;
    private String description;
    private Double marketPrice;
    private Double basePrice;
    private Double perDayPrice;
    private String image1;
    private String image2;
    private String image3;
    private String status;
    private Double totalPrice;
    private Double rating;
    private Integer ratingCount;

    private Long ownerId;
    private Long categoryId;
    private List<Long> bookingIds = new ArrayList<>();
}
