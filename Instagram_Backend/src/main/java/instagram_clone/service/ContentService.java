package instagram_clone.service;

import instagram_clone.dto.ContentCreateDTO;
import instagram_clone.dto.ContentDTO;
import instagram_clone.dtoconverter.ContentConverter;
import instagram_clone.dtoconverter.ContentCreateConverter;
import instagram_clone.model.Content;
import instagram_clone.model.ContentType;
import instagram_clone.model.User;
import instagram_clone.repository.ContentRepository;
import instagram_clone.repository.UserRepository;
import instagram_clone.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContentService {
    private final ContentRepository contentRepository;
    private final UserRepository userRepository;
    private final ContentCreateConverter contentCreateConverter;
    private final TagRepository tagRepository;

    public ContentService(ContentRepository contentRepository, 
                         UserRepository userRepository,
                         ContentCreateConverter contentCreateConverter,
                         TagRepository tagRepository) {
        this.contentRepository = contentRepository;
        this.userRepository = userRepository;
        this.contentCreateConverter = contentCreateConverter;
        this.tagRepository = tagRepository;
    }

    @Transactional
    public ContentDTO create(ContentCreateDTO contentCreateDTO) {
        User author = userRepository.findById(contentCreateDTO.getAuthorId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + contentCreateDTO.getAuthorId()));

        Content content = contentCreateConverter.toEntity(contentCreateDTO, author);
        
        if (contentCreateDTO.getParentId() != null) {
            Content parent = contentRepository.findById(contentCreateDTO.getParentId())
                    .orElseThrow(() -> new RuntimeException("Parent content not found with id: " + contentCreateDTO.getParentId()));
            content.setParent(parent);
        }

        Content savedContent = contentRepository.save(content);
        return ContentConverter.toDTO(savedContent);
    }

    @Transactional
    public ContentDTO update(Long id, ContentDTO contentDTO) {
        Content existingContent = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found with id: " + id));

        // Update basic fields
        existingContent.setTitle(contentDTO.getTitle());
        existingContent.setText(contentDTO.getText());
        existingContent.setImage(contentDTO.getImage());
        existingContent.setStatus(contentDTO.getStatus());
        existingContent.setCommentable(contentDTO.isCommentable());

        // Don't update author or type as these shouldn't change
        // Don't update dateTime as it should remain the original creation time

        // Handle parent relationship if it's a comment
        if (existingContent.getType() == ContentType.COMMENT && contentDTO.getParent() != null) {
            Content parent = contentRepository.findById(contentDTO.getParent().getId())
                    .orElseThrow(() -> new RuntimeException("Parent content not found with id: " + contentDTO.getParent().getId()));
            existingContent.setParent(parent);
        }

        Content updatedContent = contentRepository.save(existingContent);
        return ContentConverter.toDTO(updatedContent);
    }

    @Transactional(readOnly = true)
    public ContentDTO findById(Long id) {
        Content content = this.contentRepository.findById(id).orElseThrow();
        fetchTagsForPost(content);
        return ContentConverter.toDTO(content);
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

    @Transactional(readOnly = true)
    public List<ContentDTO> findAllPosts() {
        List<Content> posts = this.contentRepository.findByType(ContentType.POST);
        posts.forEach(this::fetchTagsForPost);
        return posts.stream()
            .map(ContentConverter::toDTO)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    private void fetchTagsForPost(Content post) {
        List<Object[]> tagResults = contentRepository.findTagsForPost(post.getId());
        post.getTags().clear();
        tagResults.forEach(tagResult -> {
            String tagName = (String) tagResult[0];
            post.getTags().add(tagRepository.findByName(tagName).orElse(null));
        });
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
