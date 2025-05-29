package instagram_clone.dtoconverter;

import instagram_clone.dto.ContentDTO;
import instagram_clone.dto.ContentUpdateDTO;
import instagram_clone.model.Content;

public class ContentUpdateConverter {
    
    public static ContentDTO toDTO(Content content) {
        ContentDTO dto = new ContentDTO();
        dto.setId(content.getId());
        dto.setTitle(content.getTitle());
        dto.setText(content.getText());
        return dto;
    }

    public static Content toEntity(ContentUpdateDTO dto) {
        Content content = new Content();
        content.setId(dto.getId());
        content.setTitle(dto.getTitle());
        content.setText(dto.getText());
        return content;
    }
} 