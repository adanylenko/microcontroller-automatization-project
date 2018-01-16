package a.danylenko.microcontroller.automatization.project.controllers;

import java.security.Principal;

import a.danylenko.microcontroller.automatization.project.data.entities.Device;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.services.DeviceService;
import a.danylenko.microcontroller.automatization.project.services.impl.ResponseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "devices")
public class DeviceController {
  private static final Logger LOG = LoggerFactory.getLogger(DeviceController.class);
  private final DeviceService deviceService;

  public DeviceController(final DeviceService deviceService) {
    this.deviceService = deviceService;
  }

  @GetMapping("/")
  public ResponseEntity<?> getUserDevices(final Principal principal) {
    LOG.debug("Get all devices for user with id={}", principal.getName());
    return ResponseService.success("Get all devices for user request success",
        deviceService.getAllByUserId(principal.getName()));
  }

  @GetMapping("/node/{nodeId}")
  public ResponseEntity<?> getNodeDevices(@PathVariable("nodeId") final String nodeId) {
    LOG.debug("Get all devices for node with id={}", nodeId);
    return ResponseService.success("Get all devices for node request success",
        deviceService.getDevicesByNodeId(nodeId));
  }

  @GetMapping("/{deviceId}")
  public ResponseEntity<?> getDeviceById(@PathVariable("deviceId") final String deviceId,
      final Principal principal) throws NoSuchItemException {
    LOG.debug("Get device by id={} request", deviceId);
    return ResponseService.success("Get device success",
        deviceService.getByIdAndUserId(deviceId, principal.getName()));
  }

  @PutMapping("/")
  public ResponseEntity<?> addDevice(@RequestBody final Device device, final Principal principal)
      throws NoSuchItemException, ItemAlreadyExistsException {
    LOG.debug("Add device with name={} and user id={}", device.getName(), device.getUserId());
    deviceService.add(device, principal.getName());
    return ResponseService.success("Add device success");
  }

  @DeleteMapping("/{deviceId}")
  public ResponseEntity<?> deleteDeviceById(@PathVariable("deviceId") final String deviceId,
      final Principal principal) throws NoSuchItemException {
    LOG.debug("Delete device with id={} request", deviceId);
    deviceService.delete(deviceId, principal.getName());
    return ResponseService.success("Device deleted success");
  }

  @PostMapping("/{deviceId}")
  public ResponseEntity<?> updateDevice(@PathVariable("deviceId") final String nodeId,
      @RequestBody final Device device, final Principal principal)
      throws NoSuchItemException, ItemAlreadyExistsException {
    LOG.debug("Update device with id={} name={} and user id={}", nodeId, device.getName(),
        device.getUserId());
    deviceService.update(device, principal.getName());
    return ResponseService.success("Device updated success");
  }
}
