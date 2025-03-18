package instagram_clone.service;

import instagram_clone.model.User;
import instagram_clone.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User save(User user) {
        return this.userRepository.save(user);
    }

    public Optional<User> findById(Long id) {
        return this.userRepository.findById(id);
    }

    public List<User> findAll() {
        return this.userRepository.findAll();
    }

    public void deleteById(Long id) {
        this.userRepository.deleteById(id);
    }
}
