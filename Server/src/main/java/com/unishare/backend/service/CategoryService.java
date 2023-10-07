package com.unishare.backend.service;

import com.unishare.backend.DTO.Request.CategoryRequest;
import com.unishare.backend.DTO.Response.CategoryResponse;
import com.unishare.backend.DTO.Response.UniversityResponse;
import com.unishare.backend.DTO.SpecialResponse.PageResponse;
import com.unishare.backend.exceptionHandlers.CategoryNotFoundException;
import com.unishare.backend.model.Category;
import com.unishare.backend.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Cacheable("category-all")
    public PageResponse<List<CategoryResponse>> getAllCategories(int page, int size) {
        if (size == Integer.MAX_VALUE) page = 0;
        Page<Category> categoryPage = categoryRepository.getCategoriesPage(PageRequest.of(page, size));

        PageResponse<List<CategoryResponse>> pageResponse = new PageResponse<>();
        //List<CategoryResponse> categories = categoryPage.stream()
                //.map(category -> new CategoryResponse(category.getId(), category.getCategoryName(), category.getDescription()))
               // .collect(Collectors.toList());

        List<CategoryResponse> categories = categoryPage.stream()
                .map(category -> new CategoryResponse(category.getId(), category.getCategoryName(), category.getDescription()))
                .collect(Collectors.toList());

        pageResponse.setData(categories);
        pageResponse.setTotalPages(categoryPage.getTotalPages());
        pageResponse.setTotalElements(categoryPage.getTotalElements());
        pageResponse.setCurrentPage(categoryPage.getNumber());
        pageResponse.setCurrentElements(categoryPage.getNumberOfElements());
        return pageResponse;
    }

    @Cacheable("category-#id")
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + id));
        return new CategoryResponse(category.getId(), category.getCategoryName(), category.getDescription());
    }

    @CacheEvict(value = {"category-all", "category-#id"}, allEntries = true)
    public CategoryResponse createCategory(CategoryRequest category) {
        Category newCategory = new Category();
        newCategory.setCategoryName(category.getCategoryName());
        newCategory.setDescription(category.getDescription());

        newCategory = categoryRepository.save(newCategory);
        return new CategoryResponse(newCategory.getId(), newCategory.getCategoryName(), newCategory.getDescription());
    }

    @CacheEvict(value = {"category-#id", "category-all"}, allEntries = true)
    public CategoryResponse updateCategory(Long id, CategoryRequest updatedCategory) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + id));

        category.setCategoryName(updatedCategory.getCategoryName());
        category.setDescription(updatedCategory.getDescription());

        category = categoryRepository.save(category);
        return new CategoryResponse(category.getId(), category.getCategoryName(), category.getDescription());
    }

    @CacheEvict(value = {"category-#id", "category-all"}, allEntries = true)
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new CategoryNotFoundException("Category not found with ID: " + id));

        categoryRepository.delete(category);
    }
}
