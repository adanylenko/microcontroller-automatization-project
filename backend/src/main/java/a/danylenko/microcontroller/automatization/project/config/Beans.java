package a.danylenko.microcontroller.automatization.project.config;

import a.danylenko.microcontroller.automatization.project.services.CommandHistoryService;
import a.danylenko.microcontroller.automatization.project.services.CommandService;
import a.danylenko.microcontroller.automatization.project.services.DeviceService;
import a.danylenko.microcontroller.automatization.project.services.NodeService;
import a.danylenko.microcontroller.automatization.project.services.StateService;
import a.danylenko.microcontroller.automatization.project.services.impl.CommandHistoryServiceImpl;
import a.danylenko.microcontroller.automatization.project.services.impl.CommandServiceImpl;
import a.danylenko.microcontroller.automatization.project.services.impl.DeviceServiceImpl;
import a.danylenko.microcontroller.automatization.project.services.impl.NodeServiceImpl;
import a.danylenko.microcontroller.automatization.project.services.impl.StateServiceImpl;
import a.danylenko.microcontroller.automatization.project.services.repositories
    .CommandHistoryRepository;
import a.danylenko.microcontroller.automatization.project.services.repositories.CommandRepository;
import a.danylenko.microcontroller.automatization.project.services.repositories.DeviceRepository;
import a.danylenko.microcontroller.automatization.project.services.repositories.NodeRepository;
import a.danylenko.microcontroller.automatization.project.services.repositories.StateRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class Beans {
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

  @Bean
  public CommandHistoryService commandHistoryService(final DeviceService deviceService,
      final CommandHistoryRepository commandHistoryRepository) {
    return new CommandHistoryServiceImpl(deviceService, commandHistoryRepository);
  }
}

