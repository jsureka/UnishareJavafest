package com.unishare.backend.repository;

import java.util.Optional;

import com.unishare.backend.model.University;
import com.unishare.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = :email")
    User findByUsername(@Param("email") String email);

    @Query(value = "SELECT p FROM User p")
    Page<User> getUsersPage(final Pageable pageable);

}

