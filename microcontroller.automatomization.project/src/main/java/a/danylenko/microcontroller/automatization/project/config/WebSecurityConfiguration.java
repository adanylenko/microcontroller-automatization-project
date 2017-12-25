package a.danylenko.microcontroller.automatization.project.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration
    .WebSecurityConfigurerAdapter;

//@Configuration
//@EnableWebSecurity
//@Order(3)
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

  @Override
  public void configure(final WebSecurity web) throws Exception {
    web.ignoring()
        .antMatchers("/webjars/springfox-swagger-ui/**", "/swagger*", "/swagger-resources/**",
            "/v2/api-docs/**");
  }
}