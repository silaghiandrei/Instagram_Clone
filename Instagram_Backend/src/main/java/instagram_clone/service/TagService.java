package instagram_clone.service;

import instagram_clone.model.Tag;
import instagram_clone.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TagService {
    private final TagRepository tagRepository;

    public TagService(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
    }

    public Tag save(Tag tag) {
        return this.tagRepository.save(tag);
    }

    public Optional<Tag> findById(Long id) {
        return this.tagRepository.findById(id);
    }

    public List<Tag> findAll() {
        return this.tagRepository.findAll();
    }

    public void deleteById(Long id) {
        this.tagRepository.deleteById(id);
    }
}