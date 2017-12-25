package a.danylenko.microcontroller.automatization.project.controllers;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.Device;
import a.danylenko.microcontroller.automatization.project.data.entities.Node;
import a.danylenko.microcontroller.automatization.project.services.repositories.NodeRepository;
import a.danylenko.microcontroller.automatization.project.services.repositories.DeviceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "testcontroller")
public class TestController {
  private static final Logger LOG = LoggerFactory.getLogger(TestController.class);
  private final NodeRepository nodeRepository;
  private final DeviceRepository deviceRepository;

  public TestController(final NodeRepository nodeRepository,
      final DeviceRepository deviceRepository) {
    this.nodeRepository = nodeRepository;
    this.deviceRepository = deviceRepository;
  }

  @GetMapping(value = "/testNode")
  public List<Node> checkServicesHealth() {
    LOG.debug("rest");
//    return new Node(4, "test", "test2");
    return nodeRepository.findAll();
  }

  @PreAuthorize("hasAuthority('ADMIN')")
  @GetMapping(value = "/testDevice")
  public List<Device> checkDeviceService() {
    LOG.debug("rest");
//    return new Node(4, "test", "test2");
    try {
      deviceRepository.findAll();
    } catch (Exception ex) {
      LOG.error("error", ex);
    }
    return deviceRepository.findAll();
  }
}
