package instagram_clone.dto;

import instagram_clone.model.UserRole;
import lombok.Data;

@Data
public class UserDTO {
    private String username;
    private String email;
    private UserRole role;
    private Integer score;
    private Boolean banned;
}
