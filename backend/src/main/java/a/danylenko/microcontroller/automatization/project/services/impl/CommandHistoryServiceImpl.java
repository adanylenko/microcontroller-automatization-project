package a.danylenko.microcontroller.automatization.project.services.impl;

import java.util.Date;
import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.CommandHistory;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.services.CommandHistoryService;
import a.danylenko.microcontroller.automatization.project.services.DeviceService;
import a.danylenko.microcontroller.automatization.project.services.repositories
    .CommandHistoryRepository;
import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CommandHistoryServiceImpl implements CommandHistoryService {
  private static final Logger LOG = LoggerFactory.getLogger(CommandHistoryServiceImpl.class);

  private final DeviceService deviceService;
  private final CommandHistoryRepository commandHistoryRepository;

  public CommandHistoryServiceImpl(final DeviceService deviceService,
      final CommandHistoryRepository commandHistoryRepository) {
    this.deviceService = deviceService;
    this.commandHistoryRepository = commandHistoryRepository;
  }

  @Override
  public List<CommandHistory> getCommandsHistoryByUserIdAndDeviceId(final String userId,
      final String deviceId) {
    Preconditions.checkNotNull(userId, "User id can't be null");
    Preconditions.checkNotNull(deviceId, "Device id can't be null");

    LOG.debug("Get commands history by user id={} and device id={}", userId, deviceId);
    return commandHistoryRepository.findAllByUserIdAndDeviceId(userId, deviceId);
  }

  @Override
  public CommandHistory getByIdAndUserId(final String id, final String userId)
      throws NoSuchItemException {
    Preconditions.checkNotNull(id, "Record id can't be null");
    Preconditions.checkNotNull(userId, "User id can't be null");

    LOG.debug("Get command history entry by id={} and userId={}", id, userId);

    final CommandHistory commandHistory = commandHistoryRepository.findByIdAndUserId(id, userId);

    if (commandHistory == null) {
      throw new NoSuchItemException(
          String.format("CommandHistory entry with id=%s and userId=%s not found", id, userId));
    }

    return commandHistory;
  }

  @Override
  public List<CommandHistory> getAllByUserId(final String userId) {
    Preconditions.checkNotNull(userId, "User id can't be null");

    LOG.debug("Get all command history entries by userId={}", userId);
    return commandHistoryRepository.findAllByUserId(userId);
  }

  @Override
  public void add(final CommandHistory item, final String userId)
      throws ItemAlreadyExistsException, NoSuchItemException {
    Preconditions.checkNotNull(item, "Command history item can't be null");
    Preconditions.checkNotNull(item.getCommandId(), "Command id can't be null");
    Preconditions.checkNotNull(item.getDeviceId(), "Device id can't be null");
    Preconditions.checkNotNull(userId, "User id can't be null");

    LOG.debug("Save command history item with commandId={}, deviceId={}", item.getCommandId(),
        item.getDeviceId());

    deviceService.getByIdAndUserId(item.getDeviceId(), userId);

    try {
      getByIdAndUserId(item.getId(), userId);
      throw new ItemAlreadyExistsException(String
          .format("Command history entry already exist " + "with id=%s and userId=%s", item.getId(),
              userId));
    } catch (NoSuchItemException ex) {
      final CommandHistory commandHistory =
          new CommandHistory(item.getDeviceId(), item.getCommandId(), new Date().getTime(),
              item.isResult(), item.getResponse(), userId);

      commandHistoryRepository.save(commandHistory);
    }
  }

  @Override
  public void delete(final String id, final String userId) throws NoSuchItemException {
    LOG.debug("Not implemented and not needed");
  }

  @Override
  public void update(final CommandHistory item, final String userId) throws NoSuchItemException {
    Preconditions.checkNotNull(item, "Command history item can't be null");
    Preconditions.checkNotNull(item.getCommandId(), "Command id can't be null");
    Preconditions.checkNotNull(item.getDeviceId(), "Device id can't be null");
    Preconditions.checkNotNull(item.getId(), "Device id can't be null");
    Preconditions.checkNotNull(userId, "Command history entry id can't be null");

    LOG.debug("Update command history entry with id={},response={},userId={}", item.getId(),
        item.getResponse(), userId);

    deviceService.getByIdAndUserId(item.getDeviceId(), userId);

    final CommandHistory commandHistory = getByIdAndUserId(item.getId(), userId);
    commandHistory.setResult(item.isResult());
    commandHistory.setResponse(item.getResponse());

    commandHistoryRepository.save(commandHistory);
  }
}
