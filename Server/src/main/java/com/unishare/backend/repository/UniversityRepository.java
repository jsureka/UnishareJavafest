package com.unishare.backend.repository;

import com.unishare.backend.model.University;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityRepository extends JpaRepository<University, Long> {
    @Query(value = "SELECT p FROM University p")
    Page<University> getUnisPage(final Pageable pageable);
}
