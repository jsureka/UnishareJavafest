package com.unishare.backend.repository;

import com.unishare.backend.model.Booking;
import com.unishare.backend.model.BookingStatus;
import com.unishare.backend.model.Product;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findAllByProductId(Long categoryId);
    List<Booking> findAllByBorrowerId(Long userId);
    //List<Booking> findAllByOwnerId(Long userId);
    List<Booking> findAllByBorrowerIdAndStatus(Long userId, BookingStatus status);
    @Query("SELECT b FROM Booking b WHERE b.status = :status AND b.product.owner.id = :ownerId")
    List<Booking> findBookingsByStatusAndOwnerId(
            @Param("ownerId") Long ownerId,
            @Param("status") BookingStatus status
    );
    List<Booking> findAllByProductIdAndStatus(Long productId, String status);
}
