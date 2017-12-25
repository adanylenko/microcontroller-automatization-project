package a.danylenko.microcontroller.automatization.project.exceptions;

public class NoSuchUserException extends Exception {
  public NoSuchUserException() {
    //default constructor
  }

  public NoSuchUserException(final String message) {
    super(message);
  }
}
