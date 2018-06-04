package a.danylenko.microcontroller.automatization.project.services;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.CommandHistory;

public interface CommandHistoryService extends CrudService<CommandHistory> {
  List<CommandHistory> getCommandsHistoryByUserIdAndDeviceId(final String userId,
      final String deviceId);
}
