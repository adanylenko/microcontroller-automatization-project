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
  public List<Device> getByUserId(final String userId) {
    Preconditions.checkNotNull(userId, "Name can't be null");
    LOG.debug("Get devices by user id={}", userId);
    return deviceRepository.findAllByUserId(userId);
  }

  @Override
  public Device getById(final String id) throws NoSuchItemException {
    Preconditions.checkNotNull(id, "Device id can't be null");

    LOG.debug("Get device with id={}", id);
    final Device device = deviceRepository.findOne(id);

    if (device == null) {
      LOG.debug("Device with id={} not found", id);
      throw new NoSuchItemException(String.format("Device with id=%s not found", id));
    }

    return device;
  }

  @Override
  public List<Device> getAll() {
    LOG.debug("Get all devices request");
    return deviceRepository.findAll();
  }

  @Override
  public void add(final Device item) throws ItemAlreadyExistsException, NoSuchItemException {
    Preconditions.checkNotNull(item, "Device can't be null");
    Preconditions.checkNotNull(item.getName(), "Device name can't be null");
    Preconditions.checkNotNull(item.getNodeId(), "Node id can't be null");
    Preconditions.checkNotNull(item.getPins(), "Device pins can't be null");
    Preconditions.checkNotNull(item.getType(), "Device type can't be null");
    Preconditions.checkNotNull(item.getUserId(), "User id can't be null");

    LOG.debug("Add device with name={} and node id={}", item.getName(), item.getNodeId());
    nodeService.getById(item.getNodeId());

    final Device device =
        new Device(item.getName(), item.getType(), item.getPins(), item.getNodeId(),
            item.getUserId());

    deviceRepository.save(device);
  }

  @Override
  public void delete(final String id) throws NoSuchItemException {
    Preconditions.checkNotNull(id, "Device id cant be null");

    LOG.debug("Delete node with id={}", id);

    deviceRepository.delete(getById(id));
  }

  @Override
  public void update(final Device item) throws NoSuchItemException {
    Preconditions.checkNotNull(item, "Device can't be null");
    Preconditions.checkNotNull(item.getId(), "Device id can't be null");
    Preconditions.checkNotNull(item.getName(), "Device name can't be null");
    Preconditions.checkNotNull(item.getNodeId(), "Node id can't be null");
    Preconditions.checkNotNull(item.getPins(), "Device pins can't be null");
    Preconditions.checkNotNull(item.getType(), "Device type can't be null");

    LOG.debug("Update device with id={}", item.getId());
    nodeService.getById(item.getNodeId());

    final Device existsDevice = getById(item.getId());
    existsDevice.setName(item.getName());
    existsDevice.setPins(item.getPins());
    existsDevice.setType(item.getType());
    existsDevice.setNodeId(item.getNodeId());

    deviceRepository.save(existsDevice);
  }
}
