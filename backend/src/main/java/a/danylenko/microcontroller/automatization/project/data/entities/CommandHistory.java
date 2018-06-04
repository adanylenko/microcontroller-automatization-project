package a.danylenko.microcontroller.automatization.project.data.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
public class CommandHistory {
  @Id
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  private String id;
  private String deviceId;
  private String commandId;
  private long timestamp;
  private boolean result;
  private String response;
  private String userId;

  public CommandHistory() {
    //default constructor
  }

  public CommandHistory(final String deviceId, final String commandId, final long timestamp,
      boolean result, final String response, final String userId) {
    this.deviceId = deviceId;
    this.commandId = commandId;
    this.timestamp = timestamp;
    this.result = result;
    this.response = response;
    this.userId = userId;
  }
}
