package a.danylenko.microcontroller.automatization.project.services.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.annotation.PostConstruct;

import a.danylenko.microcontroller.automatization.project.data.entities.User;
import a.danylenko.microcontroller.automatization.project.exceptions.CantSendNotificationException;
import a.danylenko.microcontroller.automatization.project.data.entities.UserRoles;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchUserException;
import a.danylenko.microcontroller.automatization.project.exceptions.UsernameAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.services.EmailNotificationService;
import a.danylenko.microcontroller.automatization.project.services.UserService;
import a.danylenko.microcontroller.automatization.project.services.repositories.UserRepository;
import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;

public class UserServiceImpl implements UserService {
  private static final Logger LOG = LoggerFactory.getLogger(UserServiceImpl.class);

  private final UserRepository userRepository;
  private final EmailNotificationService emailNotificationService;
  private final PasswordEncoder passwordEncoder;

  @Value("${auth.user.password.length:5}")
  private int userPasswordLength;

  @Value("${auth.init.admin.email}")
  private String initAdminEmail;

  public UserServiceImpl(final UserRepository userRepository,
      final EmailNotificationService emailNotificationService,
      final PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.emailNotificationService = emailNotificationService;
    this.passwordEncoder = passwordEncoder;
  }

  @PostConstruct
  private void createFirstAdminUser()
      throws CantSendNotificationException, UsernameAlreadyExistsException {
    if (userRepository.count() == 0) {
      LOG.debug("Create init admin with email:", initAdminEmail);
      final User initAdminUser = new User(initAdminEmail, "Init User", UserRoles.ADMIN);
      initAdminUser.setPassword(initAdminEmail);
      userRepository.save(initAdminUser);
    } else {
      LOG.debug("Database already consists users, init user wasn't created");
    }
  }

  @Override
  public User getUserById(final String id) throws NoSuchUserException {
    Preconditions.checkNotNull(id, "Id can't be null");

    LOG.debug("Get user by id={}", id);

    final User user = userRepository.findOne(id);

    if (user == null) {
      LOG.debug("User with id={} not found", id);
      throw new NoSuchUserException(String.format("User with given id=%s not found", id));
    }

    return user;
  }

  @Override
  public User getUserByUsername(final String username) throws NoSuchUserException {
    Preconditions.checkNotNull(username, "Username can't be null");

    LOG.debug("Get user by username={}", username);

    final User user = userRepository.findByUsername(username);

    if (user == null) {
      LOG.debug("User with username={} not found", username);
      throw new NoSuchUserException(
          String.format("User with given username=%s not found", username));
    }

    return user;
  }

  @Override
  public List<User> getAllUsers() {
    final List<User> userList = userRepository.findAll();

    if (userList == null) {
      LOG.debug("Users not found, return empty list");
      return new ArrayList<>();
    }

    return userList;
  }

  @Override
  public User addUser(final User user)
      throws UsernameAlreadyExistsException, CantSendNotificationException {
    Preconditions.checkNotNull(user, "User can't be null");
    Preconditions.checkNotNull(user.getAuthorities(), "User role can't be null");

    LOG.debug("Create user with username={} and name={}", user.getUsername(), user.getName());

    checkUsernameFree(user.getUsername());

    final String userPassword = generateUserPassword();

    user.setPassword(passwordEncoder.encode(userPassword));

    userRepository.save(user);

    emailNotificationService.sendNotification(user.getUsername(), user.getName(), userPassword);

    return user;
  }

  @Override
  public void deleteUser(final String userId) throws NoSuchUserException {
    LOG.debug("Delete user with id={}", userId);
    final User user = getUserById(userId);
    userRepository.delete(user);
  }

  @Override
  public void updateUser(final User user)
      throws NoSuchUserException, UsernameAlreadyExistsException {
    Preconditions.checkNotNull(user, "User can't be null");
    Preconditions.checkNotNull(user.getId(), "User id can't be null");
    Preconditions.checkNotNull(user.getAuthorities(), "User role can't be null");

    LOG.debug("Update user with username={} and name={}", user.getUsername(), user.getName());

    checkUpdatedUsername(user);

    final User existsUser = getUserById(user.getId());
    existsUser.setName(user.getName());
    existsUser.setUsername(user.getUsername());

    existsUser.setRole(user.getRole());

    userRepository.save(existsUser);
  }

  @Override
  public void resetUserPassword(final String userId)
      throws NoSuchUserException, CantSendNotificationException {
    Preconditions.checkNotNull(userId, "User id can't be null");
    final User user = getUserById(userId);

    final String userPassword = generateUserPassword();
    user.setPassword(passwordEncoder.encode(userPassword));

    emailNotificationService.sendNotification(user.getUsername(), user.getName(), userPassword);

    userRepository.save(user);
  }

  private void checkUsernameFree(final String username) throws UsernameAlreadyExistsException {
    Preconditions.checkNotNull(username, "Username can't be null");

    try {
      getUserByUsername(username);
      throw new UsernameAlreadyExistsException(
          String.format("User with username=%s already exists", username));
    } catch (NoSuchUserException ex) {
      LOG.debug("User with username={} not found", username, ex);
    }
  }

  private void checkUpdatedUsername(final User user) throws UsernameAlreadyExistsException {
    Preconditions.checkNotNull(user.getUsername(), "Username can't be null");

    try {
      final User foundUser = getUserByUsername(user.getUsername());
      if (user.getId().compareTo(foundUser.getId()) != 0) {
        throw new UsernameAlreadyExistsException(
            String.format("User with username=%s already exists", user.getUsername()));
      }
    } catch (NoSuchUserException ex) {
      LOG.debug("User with username={} not found", user.getUsername(), ex);
    }
  }

  private String generateUserPassword() {
    final String password = UUID.randomUUID().toString().replace("-", "");
    LOG.debug("generated password is={}, length={}", password, userPasswordLength);

    if (userPasswordLength < password.length() && userPasswordLength > 0) {
      return password.substring(0, userPasswordLength);
    }
    return password;
  }
}
