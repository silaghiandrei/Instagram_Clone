package instagram_clone.dtoconverter;

import instagram_clone.dto.ContentCreateDTO;
import instagram_clone.model.Content;
import instagram_clone.model.ContentType;
import instagram_clone.model.PostStatus;
import instagram_clone.model.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ContentCreateConverter {
    
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
        }
        
        return content;
    }
} 