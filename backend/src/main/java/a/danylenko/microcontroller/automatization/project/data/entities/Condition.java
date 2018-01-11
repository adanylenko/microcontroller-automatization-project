package a.danylenko.microcontroller.automatization.project.data.entities;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import a.danylenko.microcontroller.automatization.project.data.ConditionType;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

@Data
@Entity
public class Condition {
  @Id
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  private String id;
  private String commandId;
  private String stateId;

  @Enumerated(EnumType.STRING)
  private ConditionType type;

  private String value;
  private String name;
  private boolean enabled;
  private String valueCommandId;
  private String userId;

  public Condition() {
  }

  public Condition(final String commandId, final String stateId, final ConditionType type,
      final String value, final String name, final boolean enabled, final String valueCommandId,
      final String userId) {
    this.commandId = commandId;
    this.stateId = stateId;
    this.type = type;
    this.value = value;
    this.name = name;
    this.enabled = enabled;
    this.valueCommandId = valueCommandId;
    this.userId = userId;
  }
}
