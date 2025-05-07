package instagram_clone.service;

import instagram_clone.dto.UserCreateDTO;
import instagram_clone.dto.UserDTO;
import instagram_clone.dtoconverter.UserConverter;
import instagram_clone.dtoconverter.UserCreateConverter;
import instagram_clone.exceptions.NonexistentUser;
import instagram_clone.model.User;
import instagram_clone.repository.UserRepository;
import instagram_clone.security.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDTO create(UserCreateDTO userDTO) {
        if (userDTO.getPassword() != null) {
            userDTO.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }
        User user = UserCreateConverter.toEntity(userDTO);
        this.userRepository.save(user);
        return UserConverter.toDTO(user);
    }

    public UserDTO login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new NonexistentUser("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return UserConverter.toDTO(user);
    }

    public UserDTO update(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id).orElseThrow();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole());
        user.setScore(userDTO.getScore());
        user.setBanned(userDTO.getBanned());
        this.userRepository.save(user);
        return UserConverter.toDTO(user);
    }

    public UserDTO findById(Long id) {
        return UserConverter.toDTO(this.userRepository.findById(id).orElseThrow());
    }

    public List<UserDTO> findAll() {
        return this.userRepository.findAll().stream().map(UserConverter::toDTO).collect(Collectors.toList());
    }

    public void deleteById(Long id) {
        this.userRepository.deleteById(id);
    }
}
