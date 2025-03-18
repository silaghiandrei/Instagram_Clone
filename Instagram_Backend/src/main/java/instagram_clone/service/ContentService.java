package instagram_clone.service;

import instagram_clone.model.Content;
import instagram_clone.model.ContentType;
import instagram_clone.repository.ContentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContentService {
    private final ContentRepository contentRepository;

    public ContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    public Content save(Content content) {
        return this.contentRepository.save(content);
    }

    public Optional<Content> findById(Long id) {
        return this.contentRepository.findById(id);
    }

    public List<Content> findAll() {
        return this.contentRepository.findAll();
    }

    public void deleteById(Long id) {
        this.contentRepository.deleteById(id);
    }

    public List<Content> findAllPosts() {
        return this.contentRepository.findByType(ContentType.POST);
    }

    public List<Content> findAllComments() {
        return this.contentRepository.findByType(ContentType.COMMENT);
    }

    public List<Content> findCommentsByParentId(Long parentId) {
        return this.contentRepository.findByParentId(parentId);
    }

    public List<Content> findByAuthorId(Long authorId) {
        return this.contentRepository.findByAuthorId(authorId);
    }
}