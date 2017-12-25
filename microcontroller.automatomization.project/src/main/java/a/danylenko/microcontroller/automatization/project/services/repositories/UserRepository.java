package a.danylenko.microcontroller.automatization.project.services.repositories;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
  User findByUsername(String username);

  List<User> findAllByUsernameStartingWith(String partOfUsername);

}