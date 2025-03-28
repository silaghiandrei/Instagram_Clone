package instagram_clone.dtoconverter;

import instagram_clone.dto.UserCreateDTO;
import instagram_clone.model.User;

public class UserCreateConverter {
    public static UserCreateDTO toDTO(User user) {
        UserCreateDTO dto = new UserCreateDTO();
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setScore(user.getScore());
        dto.setBanned(user.getBanned());
        return dto;
    }

    public static User toEntity(UserCreateDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        user.setScore(dto.getScore());
        user.setBanned(dto.getBanned());
        return user;
    }
}
