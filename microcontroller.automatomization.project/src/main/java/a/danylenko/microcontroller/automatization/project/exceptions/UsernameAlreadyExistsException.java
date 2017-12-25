package a.danylenko.microcontroller.automatization.project.exceptions;

public class UsernameAlreadyExistsException extends Exception {
  public UsernameAlreadyExistsException() {
    //default constructor
  }

  public UsernameAlreadyExistsException(final String message) {
    super(message);
  }
}
