package com.unishare.backend.repository;

import com.unishare.backend.model.Category;
import com.unishare.backend.model.University;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query(value = "SELECT p FROM Category p")
    Page<Category> getCategoriesPage(final Pageable pageable);
}
