package a.danylenko.microcontroller.automatization.project.controllers.exceptionhandlers;


import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.UsernameAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.services.impl.ResponseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


@ControllerAdvice
public class RestApiExceptionHandler {

  @ExceptionHandler(UsernameAlreadyExistsException.class)
  public ResponseEntity<?> handleUsernameAlreadyExistsException(
      final UsernameAlreadyExistsException exception) {
    return ResponseService.failed(exception.getMessage(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ItemAlreadyExistsException.class)
  public ResponseEntity<?> handleItemAlreadyExistsException(
      final ItemAlreadyExistsException exception) {
    return ResponseService.failed(exception.getMessage(), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(NoSuchItemException.class)
  public ResponseEntity<?> handleNoSuchItemException(final NoSuchItemException exception) {
    return ResponseService.failed(exception.getMessage(), HttpStatus.NOT_FOUND);
  }
}
