package instagram_clone.dtoconverter;

import instagram_clone.dto.ContentDTO;
import instagram_clone.model.Content;
import instagram_clone.model.ContentType;

public class ContentConverter {

    public static ContentDTO toDTO(Content content) {
        ContentDTO dto = new ContentDTO();
        dto.setType(content.getType());
        dto.setTitle(content.getTitle());
        dto.setText(content.getText());
        dto.setImage(content.getImage());
        dto.setDateTime(content.getDateTime());
        dto.setStatus(content.getStatus());
        dto.setCommentable(content.isCommentable());

        if (content.getType() == ContentType.COMMENT && content.getParent() != null) {
            dto.setParent(content.getParent());
        } else {
            dto.setParent(null);
        }

        return dto;
    }

    public static Content toEntity(ContentDTO dto) {
        Content content = new Content();
        content.setType(dto.getType());
        content.setTitle(dto.getTitle());
        content.setText(dto.getText());
        content.setImage(dto.getImage());
        content.setDateTime(dto.getDateTime());
        content.setStatus(dto.getStatus());
        content.setCommentable(dto.isCommentable());

        if (dto.getParent() != null) {
            content.setParent(dto.getParent());
        }

        return content;
    }
}
