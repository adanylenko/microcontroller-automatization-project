package a.danylenko.microcontroller.automatization.project.services;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.Device;

public interface DeviceService extends CrudService<Device> {
  List<Device> getDevicesByNodeId(final String nodeId);

}
