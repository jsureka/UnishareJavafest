package com.unishare.backend.model;

import jakarta.persistence.Entity;
import lombok.*;


@RequiredArgsConstructor
public enum BookingStatus {
    PENDING,
    ACCEPTED,
    REJECTED,
    LENT,
    CANCELLED,
    COMPLETED
}
