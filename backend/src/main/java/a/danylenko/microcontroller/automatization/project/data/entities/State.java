package a.danylenko.microcontroller.automatization.project.data.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
public class State {
  @Id
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  private String id;
  private String commandId;
  private String name;
  private String value;
  private String userId;

  public State() {
    //default constructor
  }

  public State(final String commandId, final String name, final String value, final String userId) {
    this.commandId = commandId;
    this.name = name;
    this.value = value;
    this.userId = userId;
  }
}
