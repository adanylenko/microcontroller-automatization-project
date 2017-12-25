package a.danylenko.microcontroller.automatization.project.exceptions;

public class ItemAlreadyExistsException extends Exception {
  public ItemAlreadyExistsException() {
    //default constructor
  }

  public ItemAlreadyExistsException(final String message) {
    super(message);
  }
}
