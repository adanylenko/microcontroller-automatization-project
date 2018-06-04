package a.danylenko.microcontroller.automatization.project.services.repositories;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.CommandHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommandHistoryRepository extends JpaRepository<CommandHistory, String> {
  List<CommandHistory> findAllByUserId(final String userId);

  List<CommandHistory> findAllByUserIdAndDeviceId(final String userId, final String deviceId);

  CommandHistory findByIdAndUserId(final String userId, final String id);
}
