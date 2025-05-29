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
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
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
        User user = this.userRepository.findById(id).orElseThrow();
        logger.info("Fetching user with ID: {}", id);
        logger.info("User profile picture exists: {}", user.getProfilePicture() != null);
        if (user.getProfilePicture() != null) {
            logger.info("Profile picture size: {} bytes", user.getProfilePicture().length);
        }
        return UserConverter.toDTO(user);
    }

    public List<UserDTO> findAll() {
        return this.userRepository.findAll().stream().map(UserConverter::toDTO).collect(Collectors.toList());
    }

    public void deleteById(Long id) {
        this.userRepository.deleteById(id);
    }

    public UserDTO updateProfilePicture(Long id, MultipartFile profilePicture) throws IOException {
        logger.info("Updating profile picture for user ID: {}", id);
        logger.info("Received file size: {} bytes", profilePicture.getSize());
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        byte[] pictureBytes = profilePicture.getBytes();
        logger.info("Converted file to {} bytes", pictureBytes.length);
        
        user.setProfilePicture(pictureBytes);
        User savedUser = userRepository.save(user);
        logger.info("Profile picture saved successfully");
        
        return UserConverter.toDTO(savedUser);
    }
}
