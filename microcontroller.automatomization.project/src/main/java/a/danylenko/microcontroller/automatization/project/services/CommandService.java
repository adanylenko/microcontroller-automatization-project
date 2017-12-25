package a.danylenko.microcontroller.automatization.project.services;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.Command;

public interface CommandService extends CrudService<Command> {
  List<Command> getCommandsByDeviceId(final String deviceId);
}
