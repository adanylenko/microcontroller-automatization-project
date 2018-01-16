package a.danylenko.microcontroller.automatization.project.services.repositories;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.Node;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NodeRepository extends JpaRepository<Node, String> {
  Node findByUrlAndUserId(final String url, final String userId);

  List<Node> findAllByUserId(final String userId);

  Node findByUserIdAndName(final String userId, final String name);

  Node findByIdAndUserId(final String id, final String userId);
}
