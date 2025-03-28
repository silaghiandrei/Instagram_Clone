package instagram_clone.controller;

import instagram_clone.dto.UserCreateDTO;
import instagram_clone.dto.UserDTO;
import instagram_clone.model.UserRole;
import instagram_clone.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;
    @InjectMocks
    private UserController userController;
    private UserDTO testUser;
    private UserCreateDTO testUserCreate;

    @BeforeEach()
    void setup() {
        testUser = new UserDTO();
        testUser.setUsername("testUser");
        testUser.setEmail("test@example.com");
        testUser.setRole(UserRole.USER);
        testUser.setBanned(false);
    }

    @BeforeEach()
    void setupCreate() {
        testUserCreate = new UserCreateDTO();
        testUserCreate.setUsername("testUser");
        testUserCreate.setEmail("test@example.com");
        testUserCreate.setRole(UserRole.USER);
        testUserCreate.setBanned(false);
    }

    @Test
    void createUser() {
        when(userService.create(any(UserCreateDTO.class))).thenReturn(testUser);
        ResponseEntity<UserDTO> response = userController.createUser(testUserCreate);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testUser, response.getBody());
        verify(userService).create(testUserCreate);
    }

    @Test
    void getUserById() {
        when(userService.findById(1L)).thenReturn(testUser);

        ResponseEntity<UserDTO> response = userController.getUserById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testUser, response.getBody());
        verify(userService).findById(1L);
    }

    @Test
    void getAllUsers() {
        List<UserDTO> users = Collections.singletonList(testUser);
        when(userService.findAll()).thenReturn(users);

        ResponseEntity<List<UserDTO>> response = userController.getAllUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        verify(userService).findAll();
    }

    @Test
    void updateUser() {
        when(userService.update(anyLong(), any(UserDTO.class))).thenReturn(testUser);

        ResponseEntity<UserDTO> response = userController.updateUser(1L, testUser);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(testUser, response.getBody());
        verify(userService).update(1L, testUser);
    }

    @Test
    void deleteUser() {
        doNothing().when(userService).deleteById(1L);

        ResponseEntity<Void> response = userController.deleteUser(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(userService).deleteById(1L);
    }
}