package com.unishare.backend.repository;

import com.unishare.backend.model.Booking;
import com.unishare.backend.model.BookingStatus;
import com.unishare.backend.model.Product;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    @Query("SELECT b FROM Booking b")
    Page<Booking> findAll(Pageable pageable);

    Page<Booking> findAllByProductId(Long categoryId, Pageable pageable);

    List<Booking> findAllByProductId(Long productId);
    @Query("SELECT b FROM Booking b WHERE b.borrower.id = :userId")
    Page<Booking> findAllByBorrowerId(Long userId, Pageable pageable);
    @Query("SELECT b FROM Booking b WHERE b.product.owner.id = :ownerId")
    Page<Booking> findAllByOwnerId(Long ownerId, Pageable pageable);
    @Query("SELECT b FROM Booking b WHERE b.status = :status AND b.product.owner.id = :ownerId")
    Page<Booking> findBookingsByStatusAndOwnerId(Long ownerId, BookingStatus status, Pageable pageable);
    Page<Booking> findAllByProductIdAndStatus(Long productId, String status, Pageable pageable);
    @Query("SELECT b FROM Booking b WHERE b.status = :status AND b.borrower.id = :borrowerId")
    Page<Booking> findAllByBorrowerIdAndStatus(Long borrowerId, BookingStatus status, Pageable pageable);

}
