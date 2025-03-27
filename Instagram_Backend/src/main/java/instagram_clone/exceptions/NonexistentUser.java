package instagram_clone.exceptions;

public class NonexistentUser extends RuntimeException{
    public NonexistentUser(String message) {
        super(message);
    }
}
