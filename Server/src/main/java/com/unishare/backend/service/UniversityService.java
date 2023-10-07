package com.unishare.backend.service;

import com.unishare.backend.DTO.Response.UniversityResponse;
import com.unishare.backend.DTO.SpecialResponse.PageResponse;
import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import com.unishare.backend.model.University;
import com.unishare.backend.repository.UniversityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UniversityService {

    private final UniversityRepository universityRepository;

    @Autowired
    public UniversityService(UniversityRepository universityRepository) {
        this.universityRepository = universityRepository;
    }

    @Cacheable("university-all")
    public PageResponse<List<UniversityResponse>> getAllUniversities(int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Page<University> universityPage = universityRepository.getUnisPage(PageRequest.of(page, size));

        PageResponse<List<UniversityResponse>> pageResponse = new PageResponse<>();
        List<UniversityResponse> universities = universityPage.stream()
                .map(uni -> new UniversityResponse(uni.getId(), uni.getUniversityName()))
                .collect(Collectors.toList());
        pageResponse.setData(universities);
        pageResponse.setTotalPages(universityPage.getTotalPages());
        pageResponse.setTotalElements(universityPage.getTotalElements());
        pageResponse.setCurrentPage(universityPage.getNumber());
        pageResponse.setCurrentElements(universityPage.getNumberOfElements());
        return pageResponse;
    }

    @Cacheable("university-#id")
    public UniversityResponse getUniversityById(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new ErrorMessageException("University is not found with ID: " + id));
        return new UniversityResponse(university.getId(), university.getUniversityName());
    }

    @CacheEvict(value = "university-all", allEntries = true)
    public UniversityResponse createUniversity(String universityName) {
        University university = new University();
        university.setUniversityName(universityName);

        university = universityRepository.save(university);
        return new UniversityResponse(university.getId(), university.getUniversityName());
    }

    @CacheEvict(value = {"university-#id", "university-all"}, allEntries = true)
    public UniversityResponse updateUniversity(Long id, String updatedUniversityName) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new ErrorMessageException("University is not found with ID: " + id));

        university.setUniversityName(updatedUniversityName);

        university = universityRepository.save(university);
        return new UniversityResponse(university.getId(), university.getUniversityName());
    }

    @CacheEvict(value = {"university-#id", "university-all"}, allEntries = true)
    public void deleteUniversity(Long id) {
        University university = universityRepository.findById(id)
                .orElseThrow(() -> new ErrorMessageException("University not found with ID: " + id));

        universityRepository.delete(university);
    }
}
