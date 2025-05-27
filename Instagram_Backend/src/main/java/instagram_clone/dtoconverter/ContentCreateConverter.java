package instagram_clone.dtoconverter;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import instagram_clone.dto.ContentCreateDTO;
import instagram_clone.model.Content;
import instagram_clone.model.ContentType;
import instagram_clone.model.PostStatus;
import instagram_clone.model.Tag;
import instagram_clone.model.User;
import instagram_clone.repository.TagRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class ContentCreateConverter {
    private final TagRepository tagRepository;
    private final ObjectMapper objectMapper;

    public ContentCreateConverter(TagRepository tagRepository) {
        this.tagRepository = tagRepository;
        this.objectMapper = new ObjectMapper();
    }
    
    public Content toEntity(ContentCreateDTO dto, User author) {
        Content content = new Content();
        content.setAuthor(author);
        content.setType(ContentType.valueOf(dto.getType()));
        content.setTitle(dto.getTitle());
        content.setText(dto.getText());
        content.setImage(dto.getImage());
        content.setDateTime(LocalDateTime.now());
        content.setStatus(PostStatus.ACTIVE);
        content.setCommentable(dto.isCommentable());
        
        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            try {
                List<String> tagNames = objectMapper.readValue(dto.getTags(), new TypeReference<List<String>>() {});
                Set<Tag> tags = new HashSet<>();
                
                for (String tagName : tagNames) {
                    Tag tag = tagRepository.findByName(tagName)
                            .orElseGet(() -> {
                                Tag newTag = new Tag();
                                newTag.setName(tagName);
                                return tagRepository.save(newTag);
                            });
                    tags.add(tag);
                }
                
                content.setTags(tags);
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse tags: " + e.getMessage(), e);
            }
        }
        
        return content;
    }
} 