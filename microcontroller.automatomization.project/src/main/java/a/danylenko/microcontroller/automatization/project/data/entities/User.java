package a.danylenko.microcontroller.automatization.project.data.entities;


import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity
public class User implements UserDetails {

  @Id
  @GeneratedValue(generator = "uuid")
  @GenericGenerator(name = "uuid", strategy = "uuid2")
  private String id;
  private String username;

  @JsonIgnore
  private String password;
  private String name;

  @Enumerated(EnumType.STRING)
  private UserRoles role;

  public User() {
    //default constructor
  }

  public User(final String username, final String name, final UserRoles role) {
    this.username = username;
    this.name = name;
    this.role = role;
  }

  public String getId() {
    return id;
  }

  public void setId(final String id) {
    this.id = id;
  }

  @Override
  public String getPassword() {
    return password;
  }

  public void setPassword(final String password) {
    this.password = password;
  }

  @Override
  public String getUsername() {
    return username;
  }

  public void setUsername(final String username) {
    this.username = username;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public UserRoles getRole() {
    return role;
  }

  public void setRole(UserRoles role) {
    this.role = role;
  }

  @JsonIgnore
  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @JsonIgnore
  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @JsonIgnore
  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @JsonIgnore
  @Override
  public boolean isEnabled() {
    return true;
  }

  @JsonIgnore
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    final List<GrantedAuthority> userAuthorities = new ArrayList<>();

    if (role != null) {
      userAuthorities.add(new SimpleGrantedAuthority(role.toString()));
    }
    return userAuthorities;
  }
}