package a.danylenko.microcontroller.automatization.project.data.entities;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
public class Device {
  @Id
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  private String id;
  private String name;

  private String pins;
  private String nodeId;
  private String userId;

  public Device() {
    //default constructor
  }

  public Device(final String name, final String pins, final String nodeId, final String userId) {
    this.name = name;
    this.pins = pins;
    this.nodeId = nodeId;
    this.userId = userId;
  }
}
