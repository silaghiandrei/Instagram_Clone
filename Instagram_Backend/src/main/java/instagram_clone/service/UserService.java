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
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public UserDTO update(Long id, UserDTO userDTO) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        existingUser.setUsername(userDTO.getUsername());
        existingUser.setEmail(userDTO.getEmail());
        existingUser.setRole(userDTO.getRole());
        existingUser.setScore(userDTO.getScore());
        existingUser.setBanned(userDTO.getBanned());

        User updatedUser = userRepository.save(existingUser);
        return UserConverter.toDTO(updatedUser);
    }

    @Transactional(readOnly = true)
    public UserDTO findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return UserConverter.toDTO(user);
    }

    @Transactional(readOnly = true)
    public List<UserDTO> findAll() {
        return userRepository.findAll().stream()
                .map(UserConverter::toDTO)
                .collect(Collectors.toList());
    }

    public void deleteById(Long id) {
        this.userRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public UserDTO findByIdWithProfilePicture(Long id) {
        System.err.println("Fetching user with ID: " + id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        System.err.println("User profile picture exists: " + (user.getProfilePicture() != null));
        if (user.getProfilePicture() != null) {
            System.err.println("Profile picture size: " + user.getProfilePicture().length + " bytes");
        }
        
        return UserConverter.toDTO(user);
    }

    @Transactional
    public UserDTO updateProfilePicture(Long id, MultipartFile profilePicture) {
        System.err.println("Updating profile picture for user ID: " + id);
        System.err.println("Received file size: " + profilePicture.getSize() + " bytes");
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        try {
            byte[] pictureBytes = profilePicture.getBytes();
            System.err.println("Converted file to " + pictureBytes.length + " bytes");
            user.setProfilePicture(pictureBytes);
            User updatedUser = userRepository.save(user);
            System.err.println("Profile picture saved successfully");
            return UserConverter.toDTO(updatedUser);
        } catch (IOException e) {
            throw new RuntimeException("Failed to process profile picture: " + e.getMessage(), e);
        }
    }
}
