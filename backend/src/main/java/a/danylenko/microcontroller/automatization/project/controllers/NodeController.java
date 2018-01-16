package a.danylenko.microcontroller.automatization.project.controllers;

import java.security.Principal;

import a.danylenko.microcontroller.automatization.project.data.entities.Node;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.services.NodeService;
import a.danylenko.microcontroller.automatization.project.services.impl.ResponseService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "nodes")
public class NodeController {
  private static final Logger LOG = LoggerFactory.getLogger(NodeController.class);
  private final NodeService nodeService;

  public NodeController(final NodeService nodeService) {
    this.nodeService = nodeService;
  }

  @GetMapping("/")
  public ResponseEntity<?> getUserNodes(final Principal principal) {
    LOG.debug("Get all nodes for user with id={}", principal.getName());
    return ResponseService.success("Get node request by userId success",
        nodeService.getAllByUserId(principal.getName()));
  }

  @GetMapping("/{nodeId}")
  public ResponseEntity<?> getNodeById(@PathVariable("nodeId") final String nodeId,
      final Principal principal) throws NoSuchItemException {
    LOG.debug("Get node by id={} and userId={}", nodeId, principal.getName());
    return ResponseService.success("Get node by id request success",
        nodeService.getByIdAndUserId(nodeId, principal.getName()));
  }

  @PutMapping("/")
  public ResponseEntity<?> addNode(@RequestBody final Node node, final Principal principal)
      throws ItemAlreadyExistsException, NoSuchItemException {

    LOG.debug("Add node with url={}, name={}, userId={}", node.getUrl(), node.getName(),
        node.getUserId());
    nodeService.add(node, principal.getName());

    return ResponseService.success("Node added success");
  }

  @DeleteMapping("/{nodeId}")
  public ResponseEntity<?> deleteNode(@PathVariable("nodeId") final String nodeId,
      final Principal principal) throws NoSuchItemException {
    LOG.debug("Delete node with id={}, userId={}", nodeId, principal.getName());
    nodeService.deleteNodeByIdAndUserId(nodeId, principal.getName());
    return ResponseService.success("Node deleted success");
  }

  @PostMapping("/{nodeId}")
  public ResponseEntity<?> updateNode(@PathVariable("nodeId") final String nodeId,
      @RequestBody final Node node, final Principal principal)
      throws ItemAlreadyExistsException, NoSuchItemException {

    LOG.debug("Update node with id={}, url={}, name={}, userId={}", nodeId, node.getUrl(),
        node.getName(), node.getUserId());
    nodeService.update(node, principal.getName());

    return ResponseService.success("Node updated success");
  }
}
