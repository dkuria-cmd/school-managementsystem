package com.school.management.academicyear.service.impl;

import com.school.management.academicyear.dto.AcademicYearDto;
import com.school.management.academicyear.entity.AcademicYear;
import com.school.management.academicyear.repository.AcademicYearRepository;
import com.school.management.academicyear.service.AcademicYearService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AcademicYearServiceImpl implements AcademicYearService {

    private final AcademicYearRepository academicYearRepository;

    public AcademicYearServiceImpl(AcademicYearRepository academicYearRepository) {
        this.academicYearRepository = academicYearRepository;
    }

    @Override
    public AcademicYearDto createAcademicYear(AcademicYearDto academicYearDto) {

        if (academicYearRepository.existsByName(academicYearDto.getName())) {
            throw new RuntimeException("Academic year already exists.");
        }

        AcademicYear academicYear = AcademicYear.builder()
                .name(academicYearDto.getName())
                .startDate(academicYearDto.getStartDate())
                .endDate(academicYearDto.getEndDate())
                .active(academicYearDto.getActive() != null ? academicYearDto.getActive() : false)
                .build();

        AcademicYear savedAcademicYear = academicYearRepository.save(academicYear);

        return mapToDto(savedAcademicYear);
    }

    @Override
    public List<AcademicYearDto> getAllAcademicYears() {
        return academicYearRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AcademicYearDto getAcademicYearById(Long id) {

        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic year not found."));

        return mapToDto(academicYear);
    }

    @Override
    public AcademicYearDto updateAcademicYear(Long id, AcademicYearDto academicYearDto) {

        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic year not found."));

        academicYear.setName(academicYearDto.getName());
        academicYear.setStartDate(academicYearDto.getStartDate());
        academicYear.setEndDate(academicYearDto.getEndDate());
        academicYear.setActive(academicYearDto.getActive());

        AcademicYear updatedAcademicYear = academicYearRepository.save(academicYear);

        return mapToDto(updatedAcademicYear);
    }

    @Override
    public void deleteAcademicYear(Long id) {

        AcademicYear academicYear = academicYearRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Academic year not found."));

        academicYearRepository.delete(academicYear);
    }

    private AcademicYearDto mapToDto(AcademicYear academicYear) {

        return AcademicYearDto.builder()
                .id(academicYear.getId())
                .name(academicYear.getName())
                .startDate(academicYear.getStartDate())
                .endDate(academicYear.getEndDate())
                .active(academicYear.getActive())
                .build();
    }
}