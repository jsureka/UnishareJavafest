package com.unishare.backend.service;

import com.unishare.backend.model.Tags;
import com.unishare.backend.repository.TagsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TagsService {

    private final TagsRepository tagsRepository;

    public TagsService(TagsRepository tagsRepository) {
        this.tagsRepository = tagsRepository;
    }

    public List<Tags> getAllTags() {
        return tagsRepository.findAll();
    }

    public Optional<Tags> getTagsById(Integer id) {
        return tagsRepository.findById(id);
    }

    public Tags createTags(Tags tags) {
        return tagsRepository.save(tags);
    }

    public Tags updateTags(Integer id, Tags updatedTags) {
        Tags existingTags = tagsRepository.findById(id).orElse(null);
        if (existingTags != null) {
            existingTags.setName(updatedTags.getName());
            return tagsRepository.save(existingTags);
        }
        return null;
    }

    public void deleteTags(Integer id) {
        tagsRepository.deleteById(id);
    }
}
