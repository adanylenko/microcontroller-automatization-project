package a.danylenko.microcontroller.automatization.project.services.impl;

import javax.annotation.PostConstruct;

import a.danylenko.microcontroller.automatization.project.data.entities.Node;
import a.danylenko.microcontroller.automatization.project.exceptions.ItemAlreadyExistsException;
import a.danylenko.microcontroller.automatization.project.exceptions.NoSuchItemException;
import a.danylenko.microcontroller.automatization.project.services.NodeService;
import a.danylenko.microcontroller.automatization.project.services.repositories.NodeRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
@DataJpaTest
public class NodeServiceTest {
  private static final Logger LOG = LoggerFactory.getLogger(NodeServiceTest.class);

  private NodeService nodeService;

  @Autowired
  private NodeRepository nodeRepository;


  @PostConstruct
  private void init() {
    nodeService = new NodeServiceImpl(nodeRepository);
  }

  @Test
  public void testCreateNodeWithEmptyUserId()
      throws ItemAlreadyExistsException, NoSuchItemException {
    final Node node = new Node("url", "name", "user id");
    try {
      nodeService.add(node, null);
      Assert.fail("Success added node without user id");
    } catch (NullPointerException ex) {
      LOG.debug("Error, when try to create node without user id={}", ex.getMessage());
    }
  }

  @Test
  public void testCreateNodeSuccess() throws ItemAlreadyExistsException, NoSuchItemException {
    final Node node = new Node("url", "name", null);
    nodeService.add(node, "user id");
  }

  @Test
  public void testCreateNodeWithEmptyData() throws ItemAlreadyExistsException, NoSuchItemException {
    try {
      nodeService.add(null, "user id");
    } catch (NullPointerException ex) {
      LOG.debug("Error, when try to add null node");
    }
  }

  @Test
  public void testCreateNodeWithAnotherUserId()
      throws ItemAlreadyExistsException, NoSuchItemException {
    final Node node = new Node("url", "name", "userId_1");
    nodeService.add(node, "userId_2");

    final Node savedNode = nodeService.getByUserIdAndName("userId_2", "name");
    Assert.assertNotNull("Node save with wrong user id", savedNode);
  }

  @Test
  public void testGetAllNodesByUserId() throws ItemAlreadyExistsException, NoSuchItemException {
    nodeService.add(new Node("url1", "name1", null), "userId_1");
    nodeService.add(new Node("url2", "name2", null), "userId_2");

    Assert.assertEquals("Can't get user nodes", 1, nodeService.getAllByUserId("userId_1").size());
  }

  @Test
  public void testUpdateNodeWithWrongUserId()
      throws ItemAlreadyExistsException, NoSuchItemException {
    nodeService.add(new Node("url1", "name1", null), "userId_1");

    final Node savedNode = nodeService.getByUserIdAndName("userId_1", "name1");
    LOG.error("saved user id={}, nodeId={}", savedNode.getUserId(), savedNode.getId());
    savedNode.setName("changedName");
    savedNode.setUrl("changedUrl");

    try {
      nodeService.update(savedNode, "userId_2");
      Assert.fail("Success updated node with invalid user id");
    } catch (NoSuchItemException ex) {
      LOG.debug("Error when try to update node with invalid user id={}", ex);
    }
  }

  @Test
  public void testUpdateNodeWithEmptyFields()
      throws ItemAlreadyExistsException, NoSuchItemException {
    nodeService.add(new Node("url1", "name1", null), "userId_1");

    final Node savedNode = nodeService.getByUserIdAndName("userId_1", "name1");
    LOG.error("saved user id={}, nodeId={}", savedNode.getUserId(), savedNode.getId());
    savedNode.setName(null);
    savedNode.setUrl(null);

    try {
      nodeService.update(savedNode, null);
      Assert.fail("Success updated node with empty fields");
    } catch (NullPointerException ex) {
      LOG.debug("Error when try to update node with empty fields={}", ex);
    }
  }

  @Test
  public void testDeleteNode() throws NoSuchItemException, ItemAlreadyExistsException {
    nodeService.add(new Node("url1", "name1", null), "userId_1");
    final Node savedNode = nodeService.getByUserIdAndName("userId_1", "name1");

    nodeService.deleteNodeByIdAndUserId(savedNode.getId(), "userId_1");

    try {
      nodeService.getByUserIdAndName("userId_1", "name1");
      Assert.fail("Success get removed node");
    } catch (NoSuchItemException ex) {
      LOG.debug("Error when try to get removed node", ex);
    }
  }

  @Test
  public void testDeleteNodeWithInvalidUserId()
      throws NoSuchItemException, ItemAlreadyExistsException {
    nodeService.add(new Node("url1", "name1", null), "userId_1");
    final Node savedNode = nodeService.getByUserIdAndName("userId_1", "name1");

    try {
      nodeService.deleteNodeByIdAndUserId(savedNode.getId(), "userId_2");
      Assert.fail("Success removed node with invalid user id");
    } catch (NoSuchItemException ex) {
      LOG.debug("Error when try to remove node with invalid user id", ex);
    }
  }
}
