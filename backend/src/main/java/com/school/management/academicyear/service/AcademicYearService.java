package com.school.management.academicyear.service;

import com.school.management.academicyear.dto.AcademicYearDto;

import java.util.List;

public interface AcademicYearService {

    AcademicYearDto createAcademicYear(AcademicYearDto academicYearDto);

    List<AcademicYearDto> getAllAcademicYears();

    AcademicYearDto getAcademicYearById(Long id);

    AcademicYearDto updateAcademicYear(Long id, AcademicYearDto academicYearDto);

    void deleteAcademicYear(Long id);
}