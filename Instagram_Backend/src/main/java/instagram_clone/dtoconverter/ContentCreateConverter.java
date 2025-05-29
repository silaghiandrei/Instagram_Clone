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
import java.util.ArrayList;
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
        content.setType(ContentType.valueOf(String.valueOf(dto.getContentType())));
        content.setTitle(dto.getTitle());
        content.setText(dto.getText());
        content.setImage(dto.getImage());
        content.setDateTime(LocalDateTime.now());
        content.setCommentable(dto.isCommentable());
        
        // Set default status
        if (dto.getStatus() != null) {
            System.out.println("Setting status from DTO: " + dto.getStatus());
            content.setStatus(dto.getStatus());
        } else {
            System.out.println("Setting default status: JUST_POSTED");
            content.setStatus(PostStatus.JUST_POSTED);
        }
        
        System.out.println("Final content status: " + content.getStatus());
        
        if (dto.getTags() != null && !dto.getTags().isEmpty()) {
            try {
                System.out.println("Raw tags string: " + dto.getTags());
                List<String> tagNames = objectMapper.readValue(dto.getTags(), new TypeReference<List<String>>() {});
                System.out.println("Parsed tag names: " + tagNames);
                Set<Tag> tags = new HashSet<>();
                
                // Create a new list to store tags that need to be saved
                List<Tag> tagsToSave = new ArrayList<>();
                
                // First, find all existing tags
                for (String tagName : tagNames) {
                    System.out.println("Processing tag: " + tagName);
                    tagRepository.findByName(tagName).ifPresent(tags::add);
                }
                
                // Then, create new tags for any that don't exist
                for (String tagName : tagNames) {
                    if (tags.stream().noneMatch(t -> t.getName().equals(tagName))) {
                        System.out.println("Creating new tag: " + tagName);
                        Tag newTag = new Tag();
                        newTag.setName(tagName);
                        tagsToSave.add(newTag);
                    }
                }
                
                // Save all new tags at once
                if (!tagsToSave.isEmpty()) {
                    List<Tag> savedTags = tagRepository.saveAll(tagsToSave);
                    tags.addAll(savedTags);
                }
                
                content.setTags(tags);
            } catch (Exception e) {
                System.err.println("Error parsing tags: " + e.getMessage());
                e.printStackTrace();
                // Don't throw an exception, just set empty tags
                content.setTags(new HashSet<>());
            }
        } else {
            System.out.println("No tags provided in DTO");
            content.setTags(new HashSet<>());
        }
        
        return content;
    }
} 