package a.danylenko.microcontroller.automatization.project.services.repositories;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.State;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StateRepository extends JpaRepository<State, String> {
  List<State> findAllByCommandId(final String commandId);

  List<State> findAllByUserId(final String userId);

  State findByIdAndUserId(final String id, final String userId);
}
