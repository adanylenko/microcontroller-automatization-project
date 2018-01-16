package a.danylenko.microcontroller.automatization.project.services.repositories;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.Command;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommandRepository extends JpaRepository<Command, String> {
  List<Command> findAllByDeviceId(final String deviceId);

  List<Command> findAllByUserId(final String userId);

  Command findByIdAndUserId(final String id, final String userId);
}
