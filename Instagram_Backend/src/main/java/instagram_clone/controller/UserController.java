package instagram_clone.controller;

import instagram_clone.model.User;
import instagram_clone.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/users"})
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping({"/create"})
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(this.userService.save(user));
    }

    @GetMapping({"/get/{id}"})
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return this.userService.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping({"/getAll"})
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(this.userService.findAll());
    }

    @PutMapping({"/update/{id}"})
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        return this.userService.findById(id).isEmpty() ? ResponseEntity.notFound().build() : ResponseEntity.ok(this.userService.save(user));
    }

    @DeleteMapping({"/delete/{id}"})
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (this.userService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            this.userService.deleteById(id);
            return ResponseEntity.ok().build();
        }
    }
}