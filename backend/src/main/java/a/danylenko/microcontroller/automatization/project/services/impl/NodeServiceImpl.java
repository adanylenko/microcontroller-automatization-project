package a.danylenko.microcontroller.automatization.project.services.impl;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.Node;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.services.NodeService;
import a.danylenko.microcontroller.automatization.project.services.repositories.NodeRepository;
import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NodeServiceImpl implements NodeService {
  private final Logger LOG = LoggerFactory.getLogger(NodeServiceImpl.class);
  private final NodeRepository nodeRepository;

  public NodeServiceImpl(final NodeRepository nodeRepository) {
    this.nodeRepository = nodeRepository;
  }

  @Override
  public Node getByIdAndUserId(final String id, final String userId) throws NoSuchItemException {
    Preconditions.checkNotNull(id, "Node id can't be null");
    Preconditions.checkNotNull(userId, "User id can't be null");
    LOG.debug("Get node with id={} and user id={}", id, userId);

    final Node node = nodeRepository.findByIdAndUserId(id, userId);
    if (node == null) {
      LOG.debug("Node with id={} not found");
      throw new NoSuchItemException(String.format("Node with id=%s not found", id));
    }

    return node;
  }

  @Override
  public List<Node> getAllByUserId(final String userId) {
    Preconditions.checkNotNull(userId, "User id can't be null");

    LOG.debug("Get all nodes request");
    return nodeRepository.findAllByUserId(userId);
  }

  @Override
  public void add(final Node item, final String userId) throws ItemAlreadyExistsException {
    Preconditions.checkNotNull(userId, "User id can't be null");
    Preconditions.checkNotNull(item, "Node can't be null");
    Preconditions.checkNotNull(item.getName(), "Node name can't be null");
    Preconditions.checkNotNull(item.getUrl(), "Node url can't be null");

    if (nodeRepository.findByUrlAndUserId(item.getUrl(), userId) != null
        || nodeRepository.findByUserIdAndName(userId, item.getName()) != null) {
      LOG.debug("Error when try to add node with url={} and userId={}.\n Node already exists.",
          item.getUrl(), userId);
      throw new ItemAlreadyExistsException(
          String.format("Node with url=%s and userId=%s already exists.", item.getUrl(), userId));
    }

    LOG.debug("Node with url={}, name={} and userId={} not found add a new one.", item.getUrl(),
        item.getName(), item.getUserId());

    final Node node = new Node(item.getUrl(), item.getName(), userId);

    nodeRepository.save(node);
  }

  public Node getByUserIdAndName(final String userId, final String name)
      throws NoSuchItemException {
    Preconditions.checkNotNull(userId, "User id can't be null");
    Preconditions.checkNotNull(name, "Name id can't be null");

    final Node node = nodeRepository.findByUserIdAndName(userId, name);

    if (node == null) {
      throw new NoSuchItemException(
          String.format("Node with user id=%s and name=%s not found", userId, name));
    }

    return node;
  }

  @Override
  public void delete(final String id, final String userId) throws NoSuchItemException {
    Preconditions.checkNotNull(id, "Id can't be null");
    Preconditions.checkNotNull(userId, "User id can't be null");
    nodeRepository.delete(getByIdAndUserId(id, userId));
  }

  @Override
  public void update(final Node item, final String userId) throws NoSuchItemException {
    Preconditions.checkNotNull(userId, "User id can't be null");
    Preconditions.checkNotNull(item, "Node can't be null");
    Preconditions.checkNotNull(item.getName(), "Node name can't be null");
    Preconditions.checkNotNull(item.getUrl(), "Node url can't be null");

    final Node existsNode = getByIdAndUserId(item.getId(), userId);
    existsNode.setName(item.getName());
    existsNode.setUrl(item.getUrl());

    nodeRepository.save(existsNode);
  }

  @Override
  public boolean isNodeActive(final String id) {
    return true;
  }

  @Override
  public Node getByUrlAndUserId(final String nodeUrl, final String userId)
      throws NoSuchItemException {
    Preconditions.checkNotNull(nodeUrl, "Node url can't be null");
    Preconditions.checkNotNull(userId, "User id can't be null");

    LOG.debug("Get by url={} and userId={} ", nodeUrl, userId);

    final Node node = nodeRepository.findByUrlAndUserId(nodeUrl, userId);

    if (node == null) {
      LOG.debug("Node with url={} and userId={} not found", nodeUrl, userId);
      throw new NoSuchItemException(
          String.format("Node with url=%s and userId=%s not found", nodeUrl, userId));
    }
    return node;
  }

  @Override
  public void deleteNodeByIdAndUserId(final String nodeId, final String userId)
      throws NoSuchItemException {
    Preconditions.checkNotNull(nodeId, "NodeId can't be null");
    Preconditions.checkNotNull(userId, "UserId can't be null");

    final Node node = getByIdAndUserId(nodeId, userId);

    nodeRepository.delete(node);
  }
}
