package a.danylenko.microcontroller.automatization.project.data;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import lombok.Data;

@Data
@JsonInclude(Include.NON_NULL)
public class ResponseItem<T> {
  private int code;
  private String message;
  private T data;

  public ResponseItem(final int code, final String message, final T data) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  public ResponseItem(final int code, final String message) {
    this.code = code;
    this.message = message;
  }
}
