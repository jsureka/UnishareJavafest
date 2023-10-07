package com.unishare.backend.DTO.SpecialResponse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageResponse <T> {
    private T data;
    private int totalPages;
    private long totalElements;
    private int currentPage;
    private int currentElements;

}
