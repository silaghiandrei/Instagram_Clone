package instagram_clone.dtoconverter;

import instagram_clone.dto.ContentCreateDTO;
import instagram_clone.model.Content;
import instagram_clone.model.User;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class ContentCreateConverter {
    
    public Content toEntity(ContentCreateDTO dto, User author) {
        Content content = new Content();
        content.setTitle(dto.getTitle());
        content.setText(dto.getText());
        content.setType(dto.getType());
        content.setAuthor(author);
        content.setCommentable(dto.isCommentable());
        content.setStatus(dto.getStatus());
        content.setDateTime(LocalDateTime.now());
        return content;
    }
} 