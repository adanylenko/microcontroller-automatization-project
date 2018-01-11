package a.danylenko.microcontroller.automatization.project.exceptions;

public class NoSuchItemException extends Exception {
  public NoSuchItemException() {
    //default constructor
  }

  public NoSuchItemException(final String message) {
    super(message);
  }
}
