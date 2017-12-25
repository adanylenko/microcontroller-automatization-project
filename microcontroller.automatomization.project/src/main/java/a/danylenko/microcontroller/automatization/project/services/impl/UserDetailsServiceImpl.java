package a.danylenko.microcontroller.automatization.project.services.impl;

import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchUserException;
import a.danylenko.microcontroller.automatization.project.services.UserService;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class UserDetailsServiceImpl implements UserDetailsService {
  private final UserService userService;

  public UserDetailsServiceImpl(final UserService userService) {
    this.userService = userService;
  }

  @Override
  public UserDetails loadUserByUsername(final String username) throws UsernameNotFoundException {
    try {
      return userService.getUserByUsername(username);
    } catch (NoSuchUserException ex) {
      throw new UsernameNotFoundException(ex.getMessage());
    }
  }
}
