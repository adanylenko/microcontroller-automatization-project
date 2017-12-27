package a.danylenko.microcontroller.automatization.project.services.impl;

import java.security.Principal;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.oauth2.provider.OAuth2Authentication;

public final class UserEntityExtractor {
  public static User fromOAuth2Principal(final Principal principal) {
    final OAuth2Authentication auth2Authentication = (OAuth2Authentication) principal;
    return (User) auth2Authentication.getPrincipal();
  }
}
