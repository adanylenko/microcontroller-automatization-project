package a.danylenko.microcontroller.automatization.project.services;

import java.util.UUID;

import javax.annotation.PostConstruct;

import a.danylenko.microcontroller.automatization.project.data.entities.User;
import a.danylenko.microcontroller.automatization.project.exceptions.CantSendNotificationException;
import a.danylenko.microcontroller.automatization.project.data.entities.UserRoles;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchUserException;
import a.danylenko.microcontroller.automatization.project.exceptions.UsernameAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.services.impl.UserServiceImpl;
import a.danylenko.microcontroller.automatization.project.services.repositories.UserRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@DataJpaTest
public class UserServiceImplTest {
  private static final Logger LOG = LoggerFactory.getLogger(UserServiceImplTest.class);

  private UserServiceImpl userService;

  @Autowired
  private UserRepository userRepository;

  @Mock
  private EmailNotificationService emailNotificationService;


  public UserServiceImplTest() throws CantSendNotificationException {
    MockitoAnnotations.initMocks(this);

    Mockito.doNothing().when(emailNotificationService)
        .sendNotification(Mockito.anyString(), Mockito.anyString(), Mockito.anyString());
  }


  @PostConstruct
  private void init() {
    userService =
        new UserServiceImpl(userRepository, emailNotificationService, new BCryptPasswordEncoder());
  }

  @Test
  public void testUserCreateSuccess()
      throws NoSuchUserException, CantSendNotificationException, UsernameAlreadyExistsException {
    final String username = getTestString();
    final String name = getTestString();

    final User user = new User(username, name, UserRoles.ADMIN);
    userService.addUser(user);

    Assert.assertNotNull("Can't find registered user", userService.getUserByUsername(username));
  }

  @Test
  public void testRegisterUserWithSameUsername()
      throws UsernameAlreadyExistsException, CantSendNotificationException {
    final String username = getTestString();

    final User user1 = new User(username, getTestString(), UserRoles.USER);
    userService.addUser(user1);

    final User user2 = new User(username, getTestString(), UserRoles.USER);
    try {

      userService.addUser(user2);
      Assert.fail("UsernameAlreadyExistsException should be thrown");
    } catch (UsernameAlreadyExistsException ex) {
      LOG.debug("Error when try to add user with the same username");
    }
  }

  @Test
  public void testGetUserByUsername()
      throws NoSuchUserException, UsernameAlreadyExistsException, CantSendNotificationException {
    final String username = getTestString();

    final User user = new User(username, getTestString(), UserRoles.USER);
    userService.addUser(user);

    final User createdUser = userService.getUserByUsername(username);

    Assert.assertEquals("Username not the same", username, createdUser.getUsername());
  }

  @Test
  public void testGetUserById()
      throws NoSuchUserException, UsernameAlreadyExistsException, CantSendNotificationException {
    final String username = getTestString();

    final User user = new User(username, getTestString(), UserRoles.USER);
    final User addedUser = userService.addUser(user);

    final User createdUser = userService.getUserById(addedUser.getId());

    Assert.assertEquals("Username not the same", username, createdUser.getUsername());
  }

  @Test
  public void testDeleteUser()
      throws UsernameAlreadyExistsException, NoSuchUserException, CantSendNotificationException {
    final String username = getTestString();

    final User user = new User(username, getTestString(), UserRoles.USER);
    userService.addUser(user);

    Assert.assertNotNull("Can't get created user", userService.getUserByUsername(username));

    userService.deleteUser(userService.getUserByUsername(username).getId());

    try {
      userService.getUserByUsername(username);
      Assert.fail("NoSuchUserException should be thrown");
    } catch (NoSuchUserException ex) {
      LOG.debug("Error when try to get deleted user");
    }
  }

  @Test
  public void testDeleteNotExistsUser() {
    final String notExistsUserId = getTestString();

    try {
      userService.deleteUser(notExistsUserId);
      Assert.fail("NoSuchUserException should be thrown");
    } catch (NoSuchUserException ex) {
      LOG.debug("Error when try to delete unregistered user", ex);
    }
  }

  @Test
  public void testGetAllUsers()
      throws UsernameAlreadyExistsException, CantSendNotificationException {
    final int userCount = userService.getAllUsers().size();

    userService.addUser(new User(getTestString(), getTestString(), UserRoles.USER));

    final int newCount = userService.getAllUsers().size();

    Assert.assertTrue("User count don't increase after adding", newCount > userCount);
  }

  @Test
  public void testCreateUserWithRoles()
      throws UsernameAlreadyExistsException, NoSuchUserException, CantSendNotificationException {
    final String username = getTestString();

    final User user = new User(username, getTestString(), UserRoles.ADMIN);

    userService.addUser(user);

    final User createdUser = userService.getUserByUsername(username);

    Assert.assertEquals("User don't have created role", UserRoles.ADMIN, createdUser.getRole());
  }

  private String getTestString() {
    return UUID.randomUUID().toString();
  }
}
