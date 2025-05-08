package instagram_clone.dtoconverter;

import instagram_clone.dto.UserDTO;
import instagram_clone.model.User;

public class UserConverter {
    public static UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setScore(user.getScore());
        dto.setBanned(user.getBanned());
        return dto;
    }

    public static User toEntity(UserDTO dto) {
        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setRole(dto.getRole());
        user.setScore(dto.getScore());
        user.setBanned(dto.getBanned());
        return user;
    }
}
