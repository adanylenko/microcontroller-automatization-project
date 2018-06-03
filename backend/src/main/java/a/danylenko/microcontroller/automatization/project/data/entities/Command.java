package a.danylenko.microcontroller.automatization.project.data.entities;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import a.danylenko.microcontroller.automatization.project.data.CommandType;
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

  @Enumerated(EnumType.STRING)
  private CommandType type;

  public Command() {
    //default constructor
  }

  public Command(final String name, final String currentState, final String pins,
      final String deviceId, final String userId, final CommandType type) {
    this.name = name;
    this.currentState = currentState;
    this.pins = pins;
    this.deviceId = deviceId;
    this.userId = userId;
    this.type = type;
  }
}
