package a.danylenko.microcontroller.automatization.project.config;

import javax.sql.DataSource;

import a.danylenko.microcontroller.automatization.project.services.CommandService;
import a.danylenko.microcontroller.automatization.project.services.DeviceService;
import a.danylenko.microcontroller.automatization.project.services.EmailNotificationService;
import a.danylenko.microcontroller.automatization.project.services.EmailSender;
import a.danylenko.microcontroller.automatization.project.services.NodeService;
import a.danylenko.microcontroller.automatization.project.services.StateService;
import a.danylenko.microcontroller.automatization.project.services.impl.CommandServiceImpl;
import a.danylenko.microcontroller.automatization.project.services.impl.DeviceServiceImpl;
import a.danylenko.microcontroller.automatization.project.services.impl
    .EmailNotificationServiceImpl;
import a.danylenko.microcontroller.automatization.project.services.impl.EmailSenderImpl;
import a.danylenko.microcontroller.automatization.project.services.impl.NodeServiceImpl;
import a.danylenko.microcontroller.automatization.project.services.impl.StateServiceImpl;
import a.danylenko.microcontroller.automatization.project.services.repositories.CommandRepository;
import a.danylenko.microcontroller.automatization.project.services.repositories.DeviceRepository;
import a.danylenko.microcontroller.automatization.project.services.repositories.NodeRepository;
import a.danylenko.microcontroller.automatization.project.services.repositories.StateRepository;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.task.SimpleAsyncTaskExecutor;
import org.springframework.core.task.TaskExecutor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.config.annotation.method.configuration
    .EnableGlobalMethodSecurity;


@Configuration
//@EnableGlobalMethodSecurity(prePostEnabled = true)
public class Beans {

//  @Bean
//  public PasswordEncoder passwordEncoder() {
//    return new BCryptPasswordEncoder();
//  }
//
//  @Bean
//  public UserService userService(final UserRepository userRepository,
//      final EmailNotificationService emailNotificationService,
//      final PasswordEncoder passwordEncoder) {
//    return new UserServiceImpl(userRepository, emailNotificationService, passwordEncoder);
//  }
//
//  @Bean
//  public UserDetailsService userDetailsService(final UserService userService) {
//    return new UserDetailsServiceImpl(userService);
//  }

  @Bean
  public TaskExecutor taskExecutor() {
    return new SimpleAsyncTaskExecutor();
  }

  @Bean
  public EmailSender emailService(final JavaMailSender javaMailSender,
      final TaskExecutor taskExecutor) {
    return new EmailSenderImpl(javaMailSender, taskExecutor);
  }

  @Bean
  public EmailNotificationService emailNotificationService(final EmailSender emailSender,
      final MessageSource messageSource) {
    return new EmailNotificationServiceImpl(emailSender, messageSource);
  }

//  @Bean
//  public AuthenticationKeyGenerator authenticationKeyGenerator() {
//    return new DefaultAuthenticationKeyGenerator();
//  }

//  @Primary
//  @Bean(name = "dataSource")
//  @ConfigurationProperties(prefix = "spring.datasource")
//  public DataSource dataSource() {
//    return DataSourceBuilder.create().build();
//  }

  @Bean
  public NodeService nodeService(final NodeRepository nodeRepository) {
    return new NodeServiceImpl(nodeRepository);
  }

  @Bean
  public DeviceService deviceService(final DeviceRepository deviceRepository,
      final NodeService nodeService) {
    return new DeviceServiceImpl(deviceRepository, nodeService);
  }

  @Bean
  public CommandService commandService(final CommandRepository commandRepository,
      final DeviceService deviceService) {
    return new CommandServiceImpl(deviceService, commandRepository);
  }

  @Bean
  public StateService stateService(final StateRepository stateRepository,
      final CommandService commandService) {
    return new StateServiceImpl(stateRepository, commandService);
  }
}

