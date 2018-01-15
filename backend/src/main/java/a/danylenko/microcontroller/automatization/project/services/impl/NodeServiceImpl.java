package a.danylenko.microcontroller.automatization.project.services.impl;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.data.entities.Node;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchUserException;
import a.danylenko.microcontroller.automatization.project.services.NodeService;
import a.danylenko.microcontroller.automatization.project.services.repositories.NodeRepository;
import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NodeServiceImpl implements NodeService {
  private final Logger LOG = LoggerFactory.getLogger(NodeServiceImpl.class);
  private final NodeRepository nodeRepository;
//  private final UserService userService;

  public NodeServiceImpl(final NodeRepository nodeRepository) {
    this.nodeRepository = nodeRepository;
//    this.userService = userService;
  }

  @Override
  public Node getByIdAndUserId(final String id, final String userId) throws NoSuchItemException {
    Preconditions.checkNotNull(id, "Node id can't be null");
    Preconditions.checkNotNull(userId, "User id can't be null");
    LOG.debug("Get node with id={} and user id={}", id, userId);

    final Node node = nodeRepository.findOne(id);

    if (node == null || node.getUserId() == null || node.getUserId().compareTo(userId) != 0) {
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
  public void add(final Node item, final String userId)
      throws ItemAlreadyExistsException, NoSuchUserException {
    Preconditions.checkNotNull(userId, "User id can't be null");
    Preconditions.checkNotNull(item, "Node can't be null");
    Preconditions.checkNotNull(item.getName(), "Node name can't be null");
    Preconditions.checkNotNull(item.getUrl(), "Node url can't be null");

    item.setUserId(userId);

    if (nodeRepository.findByUrlAndUserId(item.getUrl(), item.getUserId()) != null
        || nodeRepository.findByUserIdAndName(item.getUserId(), item.getName()) != null) {
      LOG.debug("Error when try to add node with url={} and userId={}.\n Node already exists.",
          item.getUrl(), item.getUserId());
      throw new ItemAlreadyExistsException(String
          .format("Node with url=%s and userId=%s already exists.", item.getUrl(),
              item.getUserId()));
    }

    LOG.debug("Node with url={}, name={} and userId={} not found add a new one.", item.getUrl(),
        item.getName(), item.getUserId());

    final Node node = new Node(item.getUrl(), item.getName(), item.getUserId());

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

    item.setUserId(userId);

    final Node existsNode = getByIdAndUserId(item.getId(), item.getUserId());
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
