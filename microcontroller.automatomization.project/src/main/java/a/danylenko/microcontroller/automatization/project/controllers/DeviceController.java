package a.danylenko.microcontroller.automatization.project.controllers;

import a.danylenko.microcontroller.automatization.project.data.entities.Device;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchUserException;
import a.danylenko.microcontroller.automatization.project.services.DeviceService;
import a.danylenko.microcontroller.automatization.project.services.impl.ResponseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "device")
public class DeviceController {
  private static final Logger LOG = LoggerFactory.getLogger(DeviceController.class);
  private final DeviceService deviceService;

  public DeviceController(final DeviceService deviceService) {
    this.deviceService = deviceService;
  }

  @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
  @GetMapping("/list/{nodeId}")
  public ResponseEntity<?> getNodeDevices(@PathVariable("nodeId") final String nodeId) {
    LOG.debug("Get all devices for node with id={}", nodeId);
    return ResponseService.success("Get all devices for node request success",
        deviceService.getDevicesByNodeId(nodeId));
  }

  @PreAuthorize("hasAnyAuthority('ADMIN')")
  @GetMapping("/list")
  public ResponseEntity<?> getAllDevices() {
    LOG.debug("Get all devices");
    return ResponseService.success("Get all devices request success", deviceService.getAll());
  }

  @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
  @GetMapping("/{deviceId}")
  public ResponseEntity<?> getDeviceById(@PathVariable("deviceId") final String deviceId)
      throws NoSuchItemException {
    LOG.debug("Get device by id={} request", deviceId);
    return ResponseService.success("Get device success", deviceService.getById(deviceId));
  }

  @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
  @PutMapping("/")
  public ResponseEntity<?> addDevice(@RequestBody final Device device)
      throws NoSuchItemException, ItemAlreadyExistsException, NoSuchUserException {
    LOG.debug("Add device with name={} and user id={}", device.getName(), device.getUserId());
    deviceService.add(device);
    return ResponseService.success("Add device success");
  }

  @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
  @DeleteMapping("/{deviceId}")
  public ResponseEntity<?> deleteDeviceById(@PathVariable("deviceId") final String deviceId)
      throws NoSuchItemException {
    LOG.debug("Delete device with id={} request", deviceId);
    deviceService.delete(deviceId);
    return ResponseService.success("Device deleted success");
  }

  @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
  @PostMapping("/")
  public ResponseEntity<?> updateDevice(@RequestBody final Device device)
      throws NoSuchItemException, ItemAlreadyExistsException, NoSuchUserException {
    LOG.debug("Update device with name={} and user id={}", device.getName(), device.getUserId());
    deviceService.update(device);
    return ResponseService.success("Device updated success");
  }
}
