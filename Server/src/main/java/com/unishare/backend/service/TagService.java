package com.unishare.backend.service;

import com.unishare.backend.DTO.Response.TagResponse;
import com.unishare.backend.DTO.Response.UniversityResponse;
import com.unishare.backend.exceptionHandlers.ErrorMessageException;
import com.unishare.backend.model.Tag;
import com.unishare.backend.model.University;
import com.unishare.backend.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TagService {

    private final TagRepository tagRepository;

    @Autowired
    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public List<TagResponse> getAllTags() {
        List<Tag> tags = tagRepository.findAll();
        return tags.stream()
                .map(tag -> new TagResponse(tag.getId(), tag.getTagName()))
                .collect(Collectors.toList());
    }

    public TagResponse getTagById(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ErrorMessageException("Tag is not found with ID: " + id));
        return new TagResponse(tag.getId(), tag.getTagName());
    }

    public TagResponse createTag(String tagName) {
        Tag tag = new Tag();
        tag.setTagName(tagName);

        tag = tagRepository.save(tag);
        return new TagResponse(tag.getId(), tag.getTagName());
    }

    public TagResponse updateTag(Long id, Tag updatedTags) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ErrorMessageException("Tag is not found with ID: " + id));

        tag.setTagName(updatedTags.getTagName());

        tag = tagRepository.save(tag);
        return new TagResponse(tag.getId(), tag.getTagName());
    }

    public void deleteTag(Long id) {
        Tag tag = tagRepository.findById(id)
                .orElseThrow(() -> new ErrorMessageException("Tag not found with ID: " + id));

        tagRepository.delete(tag);
    }
}
