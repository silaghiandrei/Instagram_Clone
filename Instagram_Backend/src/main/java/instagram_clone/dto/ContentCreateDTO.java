package instagram_clone.dto;

import instagram_clone.model.ContentType;
import instagram_clone.model.PostStatus;
import lombok.Data;

@Data
public class ContentCreateDTO {
    private String title;
    private String text;
    private ContentType type;
    private Long authorId;
    private Long parentId;
    private boolean isCommentable;
    private PostStatus status;
} 