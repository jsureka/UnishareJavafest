package com.unishare.backend.DTO.Response;

import com.unishare.backend.model.Bookings;
import com.unishare.backend.model.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
    private Integer productId;
    private String name;
    private String description;
    private String baseprice;
    private String status;

    private Integer ownerId;
    private Integer categoryId;
    private List<Integer> bookingIds = new ArrayList<>();
}
