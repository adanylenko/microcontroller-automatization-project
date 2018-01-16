package a.danylenko.microcontroller.automatization.project.services.repositories;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.Device;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<Device, String> {
  List<Device> findAllByNodeId(final String nodeId);

  List<Device> findAllByUserId(final String userId);

  Device findByIdAndUserId(final String id, final String userId);
}
