package instagram_clone.service;

import instagram_clone.dto.ContentDTO;
import instagram_clone.dtoconverter.ContentConverter;
import instagram_clone.model.Content;
import instagram_clone.repository.ContentRepository;
import instagram_clone.model.ContentType;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContentService {
    private final ContentRepository contentRepository;

    public ContentService(ContentRepository contentRepository) {
        this.contentRepository = contentRepository;
    }

    public ContentDTO create(ContentDTO contentDTO) {
        Content content = ContentConverter.toEntity(contentDTO);
        this.contentRepository.save(content);
        return ContentConverter.toDTO(content);
    }

    public ContentDTO update(Long id, ContentDTO contentDTO) {
        Content content = contentRepository.findById(id).orElseThrow();
        content.setAuthor(contentDTO.getAuthor());
        content.setType(contentDTO.getType());
        content.setTitle(contentDTO.getTitle());
        content.setText(contentDTO.getText());
        content.setImage(contentDTO.getImage());
        content.setDateTime(contentDTO.getDateTime());
        content.setStatus(contentDTO.getStatus());
        content.setCommentable(content.isCommentable());
        this.contentRepository.save(content);
        return ContentConverter.toDTO(content);
    }

    public ContentDTO findById(Long id) {
        return ContentConverter.toDTO(this.contentRepository.findById(id).orElseThrow());
    }

    public void deleteById(Long id) {
        Content content = this.contentRepository.findById(id).orElseThrow();
        deleteChildren(content);
        this.contentRepository.deleteById(id);
    }

    private void deleteChildren(Content content) {
        List<Content> children = contentRepository.findByParentId(content.getId());
        for (Content child : children) {
            deleteChildren(child);
            contentRepository.deleteById(child.getId());
        }
    }
    public List<ContentDTO> findAllPosts() {
        return this.contentRepository.findByType(ContentType.POST).stream().map(ContentConverter::toDTO).collect(Collectors.toList());
    }

    public List<ContentDTO> findAllCommentsByParentId(Long parentId) {
        return this.contentRepository.findByParentId(parentId).stream().map(ContentConverter::toDTO).collect(Collectors.toList());
    }

    public List<ContentDTO> findPostsByAuthorId(Long authorId) {
        return this.contentRepository.findByAuthorIdAndType(authorId, ContentType.POST).stream().map(ContentConverter::toDTO).collect(Collectors.toList());
    }

    public List<ContentDTO> findCommentsByAuthorId(Long authorId) {
        return this.contentRepository.findByAuthorIdAndType(authorId, ContentType.COMMENT).stream().map(ContentConverter::toDTO).collect(Collectors.toList());
    }
}
