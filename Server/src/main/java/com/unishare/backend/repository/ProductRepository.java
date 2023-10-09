package com.unishare.backend.repository;

import com.unishare.backend.model.Product;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findProductById(Long id);

    List<Product> findAllByOwnerId(Long ownerId);

    @Query(value = "SELECT p FROM Product p WHERE p.category.id = :categoryId")
    Page<Product> findAllByCategoryId(Long categoryId, Pageable pageable);

    @Query(value = "SELECT p FROM Product p WHERE p.owner.id = :ownerId")
    Page<Product> findAllByOwnerId(Long ownerId, Pageable pageable);

    @Query(value = "SELECT p FROM Product p WHERE p.status = :status")
    Page<Product> findAllByStatus(String status, Pageable pageable);

    @Query(value = "SELECT p FROM Product p WHERE p.owner.id = :ownerId AND p.category.id = :categoryId")
    Page<Product> findAllByOwnerIdAndCategoryId(Long ownerId, Long categoryId, Pageable pageable);

    @Query(value = "SELECT p FROM Product p WHERE p.owner.id = :ownerId AND p.status = :status")
    Page<Product> findAllByOwnerIdAndStatus(Long ownerId, String status, Pageable pageable);

    @Query(value = "SELECT p FROM Product p WHERE p.category.id = :categoryId AND p.status = :status")
    Page<Product> findAllByCategoryIdAndStatus(Long categoryId, String status, Pageable pageable);

    @Query(value = "SELECT p FROM Product p WHERE p.owner.id = :ownerId AND p.category.id = :categoryId AND p.status = :status")
    Page<Product> findAllByOwnerIdAndStatusAndCategoryId(Long ownerId, String status, Long categoryId, Pageable pageable);

    @Query(value = "SELECT p FROM Product p")
    Page<Product> getProductsPage(final Pageable pageable);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE CONCAT('%', LOWER(:keyword), '%')")
    Page<Product> findByNameContainingIgnoreCase(@Param("keyword") String keyword, Pageable pageable);


//    @Query("SELECT p FROM Product p WHERE " +
//           "(:keywords IS NULL OR " +
//                   "LOWER(p.name) LIKE CONCAT('%', LOWER(:keyword1), '%') " +
//                   "OR LOWER(p.name) LIKE CONCAT('%', LOWER(:keyword2), '%') " +
//                   "OR LOWER(p.name) LIKE CONCAT('%', LOWER(:keyword3), '%'))")
//    Page<Product> advancedSearch(String keywords, Pageable pageable);
//
//    default Page<Product> advancedSearchByKeywords(String keywords, Pageable pageable) {
//        String[] keywordArray = keywords.split("\\s+");
//        String query = "SELECT p FROM Product p WHERE (:keywords IS NULL";
//        for (int i = 0; i < keywordArray.length; i++) {
//            query += " OR LOWER(p.name) LIKE CONCAT('%', LOWER(:keyword" + (i + 1) + "), '%')";
//        }
//        query += ")";
//        return advancedSearch(keywords, pageable);
//    }
}
