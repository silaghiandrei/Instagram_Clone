package instagram_clone.dto;

import instagram_clone.model.VoteType;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class VoteDTO {
    private Long id;
    private Long userId;
    private String username;
    private Long contentId;
    private String contentTitle;
    private VoteType type;
    private LocalDateTime dateTime;
} 