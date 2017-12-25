package a.danylenko.microcontroller.automatization.project.exceptions;

public class CantSendNotificationException extends Exception {
  public CantSendNotificationException() {
    //default constructor
  }

  public CantSendNotificationException(final String message) {
    super(message);
  }
}
