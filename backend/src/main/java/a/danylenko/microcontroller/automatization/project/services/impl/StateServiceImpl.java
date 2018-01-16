package a.danylenko.microcontroller.automatization.project.services.impl;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.State;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.services.CommandService;
import a.danylenko.microcontroller.automatization.project.services.StateService;
import a.danylenko.microcontroller.automatization.project.services.repositories.StateRepository;
import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class StateServiceImpl implements StateService {
  private static final Logger LOG = LoggerFactory.getLogger(StateServiceImpl.class);
  private final StateRepository stateRepository;
  private final CommandService commandService;

  public StateServiceImpl(final StateRepository stateRepository,
      final CommandService commandService) {
    this.stateRepository = stateRepository;
    this.commandService = commandService;
  }

  @Override
  public List<State> getStatesByCommandId(final String commandId) {
    Preconditions.checkNotNull(commandId, "Command id can't be null");
    LOG.debug("Get states by command id={}", commandId);
    return stateRepository.findAllByCommandId(commandId);
  }

  @Override
  public State getByIdAndUserId(final String id, final String userId) throws NoSuchItemException {
    Preconditions.checkNotNull(userId, "User id can't be null");
    Preconditions.checkNotNull(id, "State id can't be null");

    final State state = stateRepository.findByIdAndUserId(id, userId);
    if (state == null) {
      throw new NoSuchItemException(String.format("State with id=%s not found", id));
    }
    return state;
  }

  @Override
  public List<State> getAllByUserId(final String userId) {
    Preconditions.checkNotNull(userId, "User id can't be null");

    LOG.debug("Get all states request");
    return stateRepository.findAllByUserId(userId);
  }

  @Override
  public void add(final State item, final String userId)
      throws ItemAlreadyExistsException, NoSuchItemException {
    Preconditions.checkNotNull(userId, "User id can't be null");
    Preconditions.checkNotNull(item, "State can't be null");
    Preconditions.checkNotNull(item.getCommandId(), "State can't be null");
    Preconditions.checkNotNull(item.getName(), "State can't be null");
    Preconditions.checkNotNull(item.getValue(), "State can't be null");

    LOG.debug("Add state with name={} for user with id={}", item.getName(), item.getUserId());

    commandService.getByIdAndUserId(item.getCommandId(), userId);
    final State state = new State(item.getCommandId(), item.getName(), item.getValue(), userId);

    stateRepository.save(state);
  }

  @Override
  public void delete(final String id, final String userId) throws NoSuchItemException {
    Preconditions.checkNotNull(userId, "User id can't be null");
    Preconditions.checkNotNull(id, "State id can't be null");
    stateRepository.delete(getByIdAndUserId(id, userId));
  }

  @Override
  public void update(final State item, final String userId) throws NoSuchItemException {
    Preconditions.checkNotNull(userId, "User id can't be null");
    Preconditions.checkNotNull(item, "State can't be null");
    Preconditions.checkNotNull(item.getId(), "State id can't be null");
    Preconditions.checkNotNull(item.getCommandId(), "State can't be null");
    Preconditions.checkNotNull(item.getName(), "State can't be null");
    Preconditions.checkNotNull(item.getValue(), "State can't be null");

    LOG.debug("Update state with name={} for user with id={}", item.getName(), userId);
    commandService.getByIdAndUserId(item.getCommandId(), userId);

    final State existsState = getByIdAndUserId(item.getId(), userId);

    existsState.setCommandId(item.getCommandId());
    existsState.setName(item.getName());
    existsState.setValue(item.getValue());

    stateRepository.save(existsState);
  }
}
