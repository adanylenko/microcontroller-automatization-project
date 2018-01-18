package a.danylenko.microcontroller.automatization.project.controllers;

import java.security.Principal;

import a.danylenko.microcontroller.automatization.project.data.entities.Command;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.services.CommandService;
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
@RequestMapping(value = "commands")
public class CommandController {
  private static final Logger LOG = LoggerFactory.getLogger(CommandController.class);
  private final CommandService commandService;

  public CommandController(final CommandService commandService) {
    this.commandService = commandService;
  }

  @GetMapping("/list/{deviceId}")
  public ResponseEntity<?> getDeviceCommands(@PathVariable("deviceId") final String deviceId) {
    LOG.debug("Get all commands for device with id={}", deviceId);
    return ResponseService.success("Get all commands for device request success",
        commandService.getCommandsByDeviceId(deviceId));
  }

  @GetMapping("/{commandId}")
  public ResponseEntity<?> getCommandById(@PathVariable("commandId") final String commandId,
      final Principal principal) throws NoSuchItemException {
    LOG.debug("Get command by id={} request", commandId);
    return ResponseService.success("Get command success",
        commandService.getByIdAndUserId(commandId, principal.getName()));
  }

  @PutMapping("/")
  public ResponseEntity<?> addCommand(@RequestBody final Command command, final Principal principal)
      throws NoSuchItemException, ItemAlreadyExistsException {
    LOG.debug("Add command with name={} and user id={}", command.getName(), command.getUserId());
    commandService.add(command, principal.getName());
    return ResponseService.success("Add command success");
  }

  @DeleteMapping("/{commandId}")
  public ResponseEntity<?> deleteCommandById(@PathVariable("commandId") final String commandId,
      final Principal principal) throws NoSuchItemException {
    LOG.debug("Delete command with id={} request", commandId);
    commandService.delete(commandId, principal.getName());
    return ResponseService.success("Command deleted success");
  }

  @PostMapping("/{commandId}")
  public ResponseEntity<?> updateCommand(@PathVariable("commandId") final String commandId,
      @RequestBody final Command command, final Principal principal)
      throws NoSuchItemException, ItemAlreadyExistsException {
    LOG.debug("Update command with id={} and user id={}", commandId, command.getUserId());
    commandService.update(command, principal.getName());
    return ResponseService.success("Command updated success");
  }
}
