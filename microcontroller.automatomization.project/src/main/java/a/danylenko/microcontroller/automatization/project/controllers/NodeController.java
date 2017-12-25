package a.danylenko.microcontroller.automatization.project.controllers;

import java.security.Principal;

import a.danylenko.microcontroller.automatization.project.data.entities.User;
import a.danylenko.microcontroller.automatization.project.data.entities.Node;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchUserException;
import a.danylenko.microcontroller.automatization.project.services.NodeService;
import a.danylenko.microcontroller.automatization.project.services.impl.ResponseService;
import a.danylenko.microcontroller.automatization.project.services.impl.UserEntityExtractor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "node")
public class NodeController {
  private static final Logger LOG = LoggerFactory.getLogger(NodeController.class);
  private final NodeService nodeService;

  public NodeController(final NodeService nodeService) {
    this.nodeService = nodeService;
  }

  /*User endpoints*/
  @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
  @GetMapping("/list")
  public ResponseEntity<?> getUserNodes(final Principal principal) {
    final User user = UserEntityExtractor.fromOAuth2Principal(principal);
    LOG.debug("Get all nodes for user with id={}", user.getId());
    return ResponseService
        .success("Get node request by userId success", nodeService.getNodesByUserId(user.getId()));
  }

  @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
  @GetMapping("/{nodeId}")
  public ResponseEntity<?> getUserNodeById(@PathVariable("nodeId") final String nodeId,
      final Principal principal) throws NoSuchItemException {
    final User user = UserEntityExtractor.fromOAuth2Principal(principal);
    LOG.debug("Get node by id={} and userId={}", nodeId, user.getId());
    return ResponseService.success("Get node by id request success",
        nodeService.getByIdAndUserId(nodeId, user.getId()));
  }

  @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
  @PutMapping("/")
  public ResponseEntity<?> addUserNode(@RequestBody final Node node, final Principal principal)
      throws ItemAlreadyExistsException, NoSuchUserException, NoSuchItemException {
    final User user = UserEntityExtractor.fromOAuth2Principal(principal);
    node.setUserId(user.getId());

    LOG.debug("Add node with url={}, name={}, userId={}", node.getUrl(), node.getName(),
        node.getUserId());
    nodeService.add(node);

    return ResponseService.success("Node added success");
  }

  @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
  @DeleteMapping("/")
  public ResponseEntity<?> deleteUserNode(@RequestParam("nodeId") final String nodeId,
      final Principal principal) throws NoSuchItemException {
    final User user = UserEntityExtractor.fromOAuth2Principal(principal);
    LOG.debug("Delete node with id={}, userId={}", nodeId, user.getId());
    nodeService.deleteNodeByIdAndUserId(nodeId, user.getId());
    return ResponseService.success("Node deleted success");
  }

  @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
  @PostMapping("/")
  public ResponseEntity<?> updateUserNode(@RequestBody final Node node, final Principal principal)
      throws ItemAlreadyExistsException, NoSuchItemException {
    final User user = UserEntityExtractor.fromOAuth2Principal(principal);
    node.setUserId(user.getId());

    LOG.debug("Update node with url={}, name={}, userId={}", node.getUrl(), node.getName(),
        node.getUserId());
    nodeService.update(node);

    return ResponseService.success("Node added success");
  }

  /*Admin endpoints*/


  @PreAuthorize("hasAnyAuthority('ADMIN')")
  @GetMapping("/admin/list")
  public ResponseEntity<?> getAllNodesAdmin() {
    LOG.debug("Get all nodes admin request");
    return ResponseService.success("Get node admin request success", nodeService.getAll());
  }

  @PreAuthorize("hasAnyAuthority('ADMIN')")
  @GetMapping("/admin/{nodeId}")
  public ResponseEntity<?> getNodeByIdAdmin(@PathVariable("nodeId") final String nodeId)
      throws NoSuchItemException {
    LOG.debug("Get node by id={} admin", nodeId);
    return ResponseService
        .success("Get node by id admin request success", nodeService.getById(nodeId));
  }

  @PreAuthorize("hasAnyAuthority('ADMIN')")
  @PutMapping("/admin")
  public ResponseEntity<?> addNodeAdmin(@RequestBody final Node node)
      throws ItemAlreadyExistsException, NoSuchUserException, NoSuchItemException {
    LOG.debug("Add node with url={}, name={}, userId={}", node.getUrl(), node.getName(),
        node.getUserId());
    nodeService.add(node);

    return ResponseService.success("Admin node added success");
  }

  @PreAuthorize("hasAnyAuthority('ADMIN')")
  @DeleteMapping("/admin")
  public ResponseEntity<?> deleteNodeAdmin(@RequestParam("nodeId") final String nodeId)
      throws NoSuchItemException {
    LOG.debug("Delete node with id={}", nodeId);
    nodeService.delete(nodeId);
    return ResponseService.success("Admin node deleted success");
  }

  @PreAuthorize("hasAnyAuthority('ADMIN')")
  @PostMapping("/admin")
  public ResponseEntity<?> updateNodeAdmin(@RequestBody final Node node)
      throws ItemAlreadyExistsException, NoSuchItemException {

    LOG.debug("Update node admin with url={}, name={}, userId={}", node.getUrl(), node.getName(),
        node.getUserId());
    nodeService.update(node);

    return ResponseService.success("Admin node updated success");
  }

  /*Both*/
  @PreAuthorize("hasAnyAuthority('ADMIN','USER')")
  @GetMapping("/status/{nodeId}")
  public ResponseEntity<?> getNodeStatus(@RequestParam("nodeId") final String nodeId) {
    LOG.debug("Get node status with id={}", nodeId);

    return ResponseService.success("Node status request success", nodeService.isNodeActive(nodeId));
  }
}
