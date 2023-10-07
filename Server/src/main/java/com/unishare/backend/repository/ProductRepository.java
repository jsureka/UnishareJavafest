package com.unishare.backend.repository;

import com.unishare.backend.model.Product;
import com.unishare.backend.model.University;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findProductById(Long id);
    List<Product> findAllByCategoryId(Long categoryId);
    List<Product> findAllByOwnerId(Long categoryId);
    List<Product> findAllByStatus(String status);
    List<Product> findAllByOwnerIdAndCategoryId(Long ownerId, Long categoryId);
    List<Product> findAllByOwnerIdAndStatus(Long ownerId, String status);
    List<Product> findAllByCategoryIdAndStatus(Long categoryId, String status);
    List<Product> findAllByOwnerIdAndStatusAndCategoryId(Long ownerId, String status, Long categoryId);

    @Query(value = "SELECT p FROM Product p")
    Page<Product> getProductsPage(final Pageable pageable);
}
