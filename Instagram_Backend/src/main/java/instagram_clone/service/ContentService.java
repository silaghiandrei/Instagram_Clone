package instagram_clone.service;

import instagram_clone.dto.ContentCreateDTO;
import instagram_clone.dto.ContentDTO;
import instagram_clone.dto.TagDTO;
import instagram_clone.dto.ContentUpdateDTO;
import instagram_clone.dtoconverter.ContentConverter;
import instagram_clone.dtoconverter.ContentCreateConverter;
import instagram_clone.dtoconverter.ContentUpdateConverter;
import instagram_clone.model.*;
import instagram_clone.repository.ContentRepository;
import instagram_clone.repository.UserRepository;
import instagram_clone.repository.TagRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.hibernate.Hibernate;

import java.util.List;
import java.util.stream.Collectors;
import java.util.HashSet;
import java.util.Set;

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
            
            if (parent.getType() == ContentType.POST && parent.getStatus() == PostStatus.JUST_POSTED) {
                parent.setStatus(PostStatus.FIRST_REACTIONS);
                contentRepository.save(parent);
            }
        } else {
            content.setStatus(PostStatus.JUST_POSTED);
        }
        
        System.out.println("Saving content with status: " + content.getStatus());
        Content savedContent = contentRepository.save(content);
        return ContentConverter.toDTO(savedContent);
    }

    @Transactional
    public ContentDTO update(Long id, ContentUpdateDTO contentUpdateDTO) {
        try {
            Content existingContent = contentRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Content not found with id: " + id));

            System.out.println("Updating content with ID: " + id);
            System.out.println("Incoming title: " + contentUpdateDTO.getTitle());
            System.out.println("Incoming text: " + contentUpdateDTO.getText());

            existingContent.setTitle(contentUpdateDTO.getTitle());
            existingContent.setText(contentUpdateDTO.getText());

            Content updatedContent = contentRepository.save(existingContent);
            return ContentUpdateConverter.toDTO(updatedContent);
        } catch (Exception e) {
            System.err.println("Error updating content: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update content: " + e.getMessage(), e);
        }
    }

    @Transactional(readOnly = true)
    public ContentDTO findById(Long id) {
        Content content = this.contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found with id: " + id));
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
    protected void fetchTagsForPost(Content post) {
        try {
            Hibernate.initialize(post.getTags());
            List<Tag> tags = contentRepository.findTagsForPost(post.getId());
            Set<Tag> newTags = new HashSet<>(tags);
            post.setTags(newTags);
        } catch (Exception e) {
            System.err.println("Error fetching tags for post " + post.getId() + ": " + e.getMessage());
        }
    }

    public List<ContentDTO> findAllCommentsByParentId(Long parentId) {
        return this.contentRepository.findByParentId(parentId).stream().map(ContentConverter::toDTO).collect(Collectors.toList());
    }

    public List<ContentDTO> findPostsByAuthorId(Long authorId) {
        List<Content> posts = this.contentRepository.findByAuthorIdAndType(authorId, ContentType.POST);
        posts.forEach(this::fetchTagsForPost);
        return posts.stream()
            .map(ContentConverter::toDTO)
            .collect(Collectors.toList());
    }

    public List<ContentDTO> findCommentsByAuthorId(Long authorId) {
        return this.contentRepository.findByAuthorIdAndType(authorId, ContentType.COMMENT).stream().map(ContentConverter::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public ContentDTO updatePostStatus(Long id, PostStatus newStatus) {
        Content content = contentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Content not found with id: " + id));
        
        if (content.getType() != ContentType.POST) {
            throw new RuntimeException("Can only update status of posts");
        }
        
        content.setStatus(newStatus);
        Content updatedContent = contentRepository.save(content);
        return ContentConverter.toDTO(updatedContent);
    }
}
