package a.danylenko.microcontroller.automatization.project.services.repositories;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.Condition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConditionRepository extends JpaRepository<Condition, String> {
  List<Condition> findAllByUserId(final String userId);

  Condition findByIdAndUserId(final String id, final String userId);

  List<Condition> findAllByCommandId(final String commandId);
}
