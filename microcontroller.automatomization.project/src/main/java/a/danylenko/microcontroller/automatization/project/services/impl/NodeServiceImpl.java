package a.danylenko.microcontroller.automatization.project.services.impl;

import java.util.List;

import a.danylenko.microcontroller.automatization.project.services.repositories.NodeRepository;
import a.danylenko.microcontroller.automatization.project.data.entities.Node;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchUserException;
import a.danylenko.microcontroller.automatization.project.services.NodeService;
import a.danylenko.microcontroller.automatization.project.services.UserService;
import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NodeServiceImpl implements NodeService {
  private final Logger LOG = LoggerFactory.getLogger(NodeServiceImpl.class);
  private final NodeRepository nodeRepository;
  private final UserService userService;

  public NodeServiceImpl(final NodeRepository nodeRepository, final UserService userService) {
    this.nodeRepository = nodeRepository;
    this.userService = userService;
  }

  @Override
  public Node getById(final String id) throws NoSuchItemException {
    LOG.debug("Get node with id={}", id);

    final Node node = nodeRepository.findOne(id);

    if (node == null) {
      LOG.debug("Node with id={} not found");
      throw new NoSuchItemException(String.format("Node with id=%s not found", id));
    }

    return node;
  }

  @Override
  public List<Node> getAll() {
    LOG.debug("Get all nodes request");
    return nodeRepository.findAll();
  }

  @Override
  public void add(final Node item) throws ItemAlreadyExistsException, NoSuchUserException {
    Preconditions.checkNotNull(item, "Node can't be null");
    Preconditions.checkNotNull(item.getName(), "Node name can't be null");
    Preconditions.checkNotNull(item.getUrl(), "Node url can't be null");
    Preconditions.checkNotNull(item.getUserId(), "Node url can't be null");

    try {
      userService.getUserById(item.getUserId());
      getByUrlAndUserId(item.getUrl(), item.getUserId());
      LOG.debug("Error when try to add node with url={} and userId={}.\n Node already exists.",
          item.getUrl(), item.getUserId());
      throw new ItemAlreadyExistsException(String
          .format("Node with url=%s and userId=%s already exists.", item.getUrl(),
              item.getUserId()));
    } catch (final NoSuchItemException ex) {
      LOG.debug("Node with url={} and userId={} not found add a new one.", item.getUrl(),
          item.getUserId());

      final Node node = new Node(item.getUrl(), item.getName(), item.getUserId());

      nodeRepository.save(node);
    }
  }

  @Override
  public void delete(final String id) throws NoSuchItemException {
    Preconditions.checkNotNull(id, "Id can't be null");
    nodeRepository.delete(getById(id));
  }

  @Override
  public void update(final Node item) throws NoSuchItemException {
    Preconditions.checkNotNull(item, "Node can't be null");
    Preconditions.checkNotNull(item.getName(), "Node name can't be null");
    Preconditions.checkNotNull(item.getUrl(), "Node url can't be null");
    Preconditions.checkNotNull(item.getUserId(), "Node url can't be null");

    final Node existsNode = getByIdAndUserId(item.getId(), item.getUserId());
    existsNode.setName(item.getName());
//    existsNode.setUrl(item.getUrl());

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
  public List<Node> getNodesByUserId(final String userId) {
    Preconditions.checkNotNull(userId, "User id can't be null");
    return nodeRepository.findAllByUserId(userId);
  }

  @Override
  public void deleteNodeByIdAndUserId(final String nodeId, final String userId)
      throws NoSuchItemException {
    Preconditions.checkNotNull(nodeId, "NodeId can't be null");
    Preconditions.checkNotNull(userId, "UserId can't be null");

    final Node node = getByIdAndUserId(nodeId, userId);

    nodeRepository.delete(node);
  }

  @Override
  public Node getByIdAndUserId(final String nodeId, final String userId)
      throws NoSuchItemException {
    Preconditions.checkNotNull(nodeId, "Node id can't be null");
    Preconditions.checkNotNull(userId, "User id can't be null");

    final Node node = getById(nodeId);
    if (node.getUserId().compareTo(userId) != 0) {
      throw new NoSuchItemException(
          String.format("Node with id=%s belongs to another user You can't delete them", nodeId));
    }

    return node;
  }
}
