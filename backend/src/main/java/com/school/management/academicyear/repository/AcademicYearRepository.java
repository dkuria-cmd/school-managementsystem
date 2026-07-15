package com.school.management.academicyear.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.school.management.academicyear.entity.AcademicYear;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYear, Long> {

    Optional<AcademicYear> findByName(String name);

    boolean existsByName(String name);

    Optional<AcademicYear> findByActiveTrue();
}