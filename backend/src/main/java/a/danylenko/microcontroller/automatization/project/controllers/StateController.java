package a.danylenko.microcontroller.automatization.project.controllers;

import java.security.Principal;

import a.danylenko.microcontroller.automatization.project.data.entities.State;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.services.StateService;
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
@RequestMapping(value = "states")
public class StateController {
  private static final Logger LOG = LoggerFactory.getLogger(StateController.class);
  private final StateService stateService;

  public StateController(final StateService stateService) {
    this.stateService = stateService;
  }

  @GetMapping("/list/{commandId}")
  public ResponseEntity<?> getCommandStates(@PathVariable("commandId") final String commandId) {
    LOG.debug("Get all states for command with id={}", commandId);
    return ResponseService.success("Get all states for command request success",
        stateService.getStatesByCommandId(commandId));
  }

  @GetMapping("/{stateId}")
  public ResponseEntity<?> getStateById(@PathVariable("stateId") final String stateId,
      final Principal principal) throws NoSuchItemException {
    LOG.debug("Get state by id={} request", stateId);
    return ResponseService
        .success("Get state success", stateService.getByIdAndUserId(stateId, principal.getName()));
  }

  @PutMapping("/")
  public ResponseEntity<?> addState(@RequestBody final State state, final Principal principal)
      throws NoSuchItemException, ItemAlreadyExistsException {
    LOG.debug("Add state with name={} and user id={}", state.getName(), state.getUserId());
    stateService.add(state, principal.getName());
    return ResponseService.success("Add state success");
  }

  @DeleteMapping("/{stateId}")
  public ResponseEntity<?> deleteStateById(@PathVariable("stateId") final String stateId,
      final Principal principal) throws NoSuchItemException {
    LOG.debug("Delete state with id={} request", stateId);
    stateService.delete(stateId, principal.getName());
    return ResponseService.success("State deleted success");
  }

  @PostMapping("/")
  public ResponseEntity<?> updateState(@RequestBody final State state, final Principal principal)
      throws NoSuchItemException, ItemAlreadyExistsException {
    LOG.debug("Update state with name={} and user id={}", state.getName(), state.getUserId());
    stateService.update(state, principal.getName());
    return ResponseService.success("State updated success");
  }
}
