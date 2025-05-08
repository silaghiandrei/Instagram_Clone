package instagram_clone.dtoconverter;

import instagram_clone.dto.ContentDTO;
import instagram_clone.model.Content;
import instagram_clone.model.ContentType;
import instagram_clone.model.User;

public class ContentConverter {

    public static ContentDTO toDTO(Content content) {
        ContentDTO dto = new ContentDTO();
        
        User author = content.getAuthor();
        if (author != null) {
            User authorInfo = new User();
            authorInfo.setId(author.getId());
            authorInfo.setUsername(author.getUsername());
            authorInfo.setEmail(author.getEmail());
            authorInfo.setRole(author.getRole());
            authorInfo.setScore(author.getScore());
            authorInfo.setBanned(author.getBanned());
            dto.setAuthor(authorInfo);
        }
        
        dto.setType(content.getType());
        dto.setTitle(content.getTitle());
        dto.setText(content.getText());
        dto.setImage(content.getImage());
        dto.setDateTime(content.getDateTime());
        dto.setStatus(content.getStatus());
        dto.setCommentable(content.isCommentable());

        if (content.getType() == ContentType.COMMENT && content.getParent() != null) {
            Content parent = new Content();
            parent.setId(content.getParent().getId());
            parent.setTitle(content.getParent().getTitle());
            parent.setText(content.getParent().getText());
            parent.setType(content.getParent().getType());
            dto.setParent(parent);
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
