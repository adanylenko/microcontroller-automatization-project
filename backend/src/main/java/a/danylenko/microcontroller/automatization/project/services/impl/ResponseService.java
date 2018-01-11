package a.danylenko.microcontroller.automatization.project.services.impl;

import a.danylenko.microcontroller.automatization.project.data.ResponseItem;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public final class ResponseService {
  private ResponseService() {
    //hide default constructor
  }

  public static ResponseEntity<ResponseItem> failed(final String message, final HttpStatus status) {
    return new ResponseEntity<>(new ResponseItem(status.value(), message), status);
  }

  public static ResponseEntity<ResponseItem> success(final String message) {
    return new ResponseEntity<>(new ResponseItem(HttpStatus.OK.value(), message), HttpStatus.OK);
  }

  public static <T> ResponseEntity<ResponseItem<T>> success(final String message, final T data) {
    return new ResponseEntity<>(new ResponseItem<>(HttpStatus.OK.value(), message, data),
        HttpStatus.OK);
  }
}
