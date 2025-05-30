package instagram_clone.dto;

import instagram_clone.model.UserRole;
import lombok.Data;

@Data
public class UserCreateDTO {
    private Long id;
    private String username;
    private String email;
    private String password;
    private UserRole role;
    private Double score;
    private Boolean banned;
}
