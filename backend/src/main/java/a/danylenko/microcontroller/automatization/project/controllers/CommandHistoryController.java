package a.danylenko.microcontroller.automatization.project.controllers;

import java.security.Principal;

import a.danylenko.microcontroller.automatization.project.services.CommandHistoryService;
import a.danylenko.microcontroller.automatization.project.services.impl.ResponseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "command-history")
public class CommandHistoryController {
  private static final Logger LOG = LoggerFactory.getLogger(CommandController.class);
  private final CommandHistoryService commandHistoryService;

  public CommandHistoryController(final CommandHistoryService commandHistoryService) {
    this.commandHistoryService = commandHistoryService;
  }

  @GetMapping("/list/{deviceId}")
  public ResponseEntity<?> getDeviceCommandsHistory(@PathVariable("deviceId") final String deviceId,
      final Principal principal) {
    LOG.debug("Get all commands history for device with id={}", deviceId);
    return ResponseService.success("Get all commands history for device request success",
        commandHistoryService.getCommandsHistoryByUserIdAndDeviceId(principal.getName(), deviceId));
  }
}
