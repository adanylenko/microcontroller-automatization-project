package a.danylenko.microcontroller.automatization.project.data.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
public class Command {
  @Id
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  private String id;
  private String name;
  private String currentState;
  private String pins;
  private String deviceId;
  private String userId;

  public Command() {
    //default constructor
  }

  public Command(final String name, final String currentState, final String pins,
      final String deviceId, final String userId) {
    this.name = name;
    this.currentState = currentState;
    this.pins = pins;
    this.deviceId = deviceId;
    this.userId = userId;
  }
}
