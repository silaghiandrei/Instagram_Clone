package instagram_clone.dto;

import instagram_clone.model.UserRole;
import lombok.Data;
import java.util.Base64;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private UserRole role;
    private Integer score;
    private Boolean banned;
    private String profilePicture;

    public void setProfilePicture(byte[] profilePicture) {
        if (profilePicture != null) {
            this.profilePicture = Base64.getEncoder().encodeToString(profilePicture);
        }
    }
}
