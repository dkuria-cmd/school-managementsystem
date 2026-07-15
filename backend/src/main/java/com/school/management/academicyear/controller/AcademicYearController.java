package com.school.management.academicyear.controller;

import com.school.management.academicyear.dto.AcademicYearDto;
import com.school.management.academicyear.service.AcademicYearService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/academic-years")
@CrossOrigin(origins = "http://localhost:5173")
public class AcademicYearController {

    private final AcademicYearService academicYearService;

    public AcademicYearController(AcademicYearService academicYearService) {
        this.academicYearService = academicYearService;
    }

    @PostMapping
    public ResponseEntity<AcademicYearDto> createAcademicYear(
            @Valid @RequestBody AcademicYearDto academicYearDto) {

        AcademicYearDto savedAcademicYear =
                academicYearService.createAcademicYear(academicYearDto);

        return new ResponseEntity<>(savedAcademicYear, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AcademicYearDto>> getAllAcademicYears() {
        return ResponseEntity.ok(academicYearService.getAllAcademicYears());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcademicYearDto> getAcademicYearById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                academicYearService.getAcademicYearById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AcademicYearDto> updateAcademicYear(
            @PathVariable Long id,
            @Valid @RequestBody AcademicYearDto academicYearDto) {

        return ResponseEntity.ok(
                academicYearService.updateAcademicYear(id, academicYearDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAcademicYear(
            @PathVariable Long id) {

        academicYearService.deleteAcademicYear(id);

        return ResponseEntity.ok("Academic Year deleted successfully.");
    }
}