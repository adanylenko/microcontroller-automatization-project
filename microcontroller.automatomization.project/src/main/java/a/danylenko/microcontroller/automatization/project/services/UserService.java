package a.danylenko.microcontroller.automatization.project.services;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.User;
import a.danylenko.microcontroller.automatization.project.exceptions.CantSendNotificationException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchUserException;
import a.danylenko.microcontroller.automatization.project.exceptions.UsernameAlreadyExistsException;

public interface UserService {

  User getUserById(String id) throws NoSuchUserException;


  User getUserByUsername(String username) throws NoSuchUserException;

  List<User> getAllUsers();

  User addUser(User user) throws UsernameAlreadyExistsException, CantSendNotificationException;

  void deleteUser(String userId) throws NoSuchUserException;

  void updateUser(User user) throws NoSuchUserException, UsernameAlreadyExistsException;

  void resetUserPassword(String userId) throws NoSuchUserException, CantSendNotificationException;
}
