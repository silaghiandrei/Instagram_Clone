package instagram_clone.dto;

import instagram_clone.model.Content;
import instagram_clone.model.ContentType;
import instagram_clone.model.PostStatus;
import instagram_clone.model.User;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
public class ContentDTO {
    private Long id;
    private User author;
    private ContentType type;
    private String title;
    private String text;
    private byte[] image;
    private LocalDateTime dateTime;
    private PostStatus status;
    private Content parent;
    private boolean isCommentable;
    private Set<TagDTO> tags = new HashSet<>();
    private Integer upvotes;
    private Integer downvotes;
}
