package a.danylenko.microcontroller.automatization.project.config;

import com.auth0.spring.security.api.JwtWebSecurityConfigurer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration
    .WebSecurityConfigurerAdapter;

@EnableWebSecurity
@Configuration
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

  @Value("${auth0.apiAudience}")
  private String audience;

  @Value("${auth0.issuer}")
  private String issuer;

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    JwtWebSecurityConfigurer.forRS256(audience, issuer).configure(http).csrf()
        .disable().authorizeRequests().antMatchers("/swagger").permitAll().and().authorizeRequests()
        .anyRequest().fullyAuthenticated();
  }
}