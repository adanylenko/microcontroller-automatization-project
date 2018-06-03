package a.danylenko.microcontroller.automatization.project.services.impl;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.Device;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.services.DeviceService;
import a.danylenko.microcontroller.automatization.project.services.NodeService;
import a.danylenko.microcontroller.automatization.project.services.repositories.DeviceRepository;
import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DeviceServiceImpl implements DeviceService {
  private static final Logger LOG = LoggerFactory.getLogger(DeviceServiceImpl.class);

  private final DeviceRepository deviceRepository;
  private final NodeService nodeService;

  public DeviceServiceImpl(final DeviceRepository deviceRepository, final NodeService nodeService) {
    this.deviceRepository = deviceRepository;
    this.nodeService = nodeService;
  }

  @Override
  public List<Device> getDevicesByNodeId(final String nodeId) {
    Preconditions.checkNotNull(nodeId, "Node id can't be null");
    LOG.debug("Get devices with node id={}", nodeId);
    return deviceRepository.findAllByNodeId(nodeId);
  }

  @Override
  public Device getByIdAndUserId(final String id, final String userId) throws NoSuchItemException {
    Preconditions.checkNotNull(id, "Device id can't be null");
    Preconditions.checkNotNull(userId, "User id can't be null");

    LOG.debug("Get device with id={} and user id={}", id, userId);
    final Device device = deviceRepository.findByIdAndUserId(id, userId);

    if (device == null) {
      LOG.debug("Device with id={} not found", id);
      throw new NoSuchItemException(String.format("Device with id=%s not found", id));
    }

    return device;
  }

  @Override
  public List<Device> getAllByUserId(final String userId) {
    Preconditions.checkNotNull(userId, "Name can't be null");
    LOG.debug("Get devices by user id={}", userId);
    return deviceRepository.findAllByUserId(userId);
  }

  @Override
  public void add(final Device item, final String userId)
      throws ItemAlreadyExistsException, NoSuchItemException {
    Preconditions.checkNotNull(userId, "User id be null");
    Preconditions.checkNotNull(item, "Device can't be null");
    Preconditions.checkNotNull(item.getName(), "Device name can't be null");
    Preconditions.checkNotNull(item.getNodeId(), "Node id can't be null");
    Preconditions.checkNotNull(item.getPins(), "Device pins can't be null");

    LOG.debug("Add device with name={} and node id={}", item.getName(), item.getNodeId());
    nodeService.getByIdAndUserId(item.getNodeId(), userId);

    final Device device = new Device(item.getName(), item.getPins(), item.getNodeId(), userId);

    deviceRepository.save(device);
  }

  @Override
  public void delete(final String id, final String userId) throws NoSuchItemException {
    Preconditions.checkNotNull(id, "Device id cant be null");
    Preconditions.checkNotNull(userId, "User id cant be null");

    LOG.debug("Delete node with id={} and user id={}", id, userId);

    deviceRepository.delete(getByIdAndUserId(id, userId));
  }

  @Override
  public void update(final Device item, final String userId) throws NoSuchItemException {
    Preconditions.checkNotNull(userId, "User id can't be null");
    Preconditions.checkNotNull(item, "Device can't be null");
    Preconditions.checkNotNull(item.getId(), "Device id can't be null");
    Preconditions.checkNotNull(item.getName(), "Device name can't be null");
    Preconditions.checkNotNull(item.getNodeId(), "Node id can't be null");
    Preconditions.checkNotNull(item.getPins(), "Device pins can't be null");

    LOG.debug("Update device with id={}", item.getId());
    nodeService.getByIdAndUserId(item.getNodeId(), userId);

    final Device existsDevice = getByIdAndUserId(item.getId(), userId);
    existsDevice.setName(item.getName());
    existsDevice.setPins(item.getPins());
    existsDevice.setNodeId(item.getNodeId());

    deviceRepository.save(existsDevice);
  }
}
