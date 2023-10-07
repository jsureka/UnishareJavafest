package com.unishare.backend.controller;

import com.unishare.backend.DTO.SpecialResponse.ApiResponse;
import com.unishare.backend.DTO.Request.TagRequest;
import com.unishare.backend.DTO.Response.TagResponse;
import com.unishare.backend.model.Tag;
import com.unishare.backend.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/api/tags")
public class TagController {

    private final TagService tagService;

    @Autowired
    public TagController(TagService tagService) {
        this.tagService = tagService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TagResponse>>> getAllTags() {
        try {
            List<TagResponse> tagResponses = tagService.getAllTags();
            return ResponseEntity.ok(new ApiResponse<>(tagResponses, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TagResponse>> getTagById(@PathVariable Long id) {
        try {
            TagResponse tagResponse = tagService.getTagById(id);
            return ResponseEntity.ok(new ApiResponse<>(tagResponse, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }

    }

    @PostMapping
    public ResponseEntity<ApiResponse<TagResponse>> createTag(@RequestBody TagRequest tag) {
        try {
            TagResponse createdTagResponse = tagService.createTag(tag.getTagName());
            return ResponseEntity.ok(new ApiResponse<>(createdTagResponse, null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TagResponse>> updateTag(@PathVariable Long id, @RequestBody Tag updatedTag) {
        try {
            TagResponse updatedTagResponse = tagService.updateTag(id, updatedTag);
            return updatedTagResponse != null
                    ? ResponseEntity.ok(new ApiResponse<>(updatedTagResponse, null))
                    : ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(null, e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTag(@PathVariable Long id) {
        try {
            tagService.deleteTag(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>());
        }
    }
}
