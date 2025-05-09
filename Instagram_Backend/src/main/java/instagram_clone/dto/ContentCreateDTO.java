package instagram_clone.dto;

import instagram_clone.model.ContentType;
import instagram_clone.model.PostStatus;
import lombok.Data;

@Data
public class ContentCreateDTO {
    private String title;
    private String text;
    private String type;
    private boolean isCommentable;
    private Long authorId;
    private Long parentId;
    private byte[] image;
    private String tags;
    private ContentType contentType;
    private PostStatus status;
} 