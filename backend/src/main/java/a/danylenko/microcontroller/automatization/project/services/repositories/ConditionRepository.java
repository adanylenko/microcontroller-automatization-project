package a.danylenko.microcontroller.automatization.project.services.repositories;

import a.danylenko.microcontroller.automatization.project.data.entities.Condition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConditionRepository extends JpaRepository<Condition, String> {
}
