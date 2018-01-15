package a.danylenko.microcontroller.automatization.project.services;

import a.danylenko.microcontroller.automatization.project.data.entities.Node;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;

public interface NodeService extends CrudService<Node> {
  boolean isNodeActive(final String nodeId);

  Node getByIdAndUserId(final String nodeId, final String userId) throws NoSuchItemException;

  Node getByUrlAndUserId(final String nodeUrl, final String userId) throws NoSuchItemException;

  void deleteNodeByIdAndUserId(final String nodeId, final String userId) throws NoSuchItemException;

  Node getByUserIdAndName(final String userId, final String name) throws NoSuchItemException;
}
