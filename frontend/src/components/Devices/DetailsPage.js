import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DckSelectors, DckActionCreators } from "dck-redux";
import { ProgressOverlay, InternalPage } from "dck-react-components";
import * as FontAwesome from "react-fontawesome";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import * as ProcessTypes from "../../redux/processes/types";
import * as ItemTypes from "../../redux/items/types";
import CommandsTable from "../Commands/Table";
import CommandHistoryTabe from "../CommandsHistory";

class DeviceDetailPage extends Component {
  static propTypes = {
    currentDevice: PropTypes.any,
    makeDeviceActive: PropTypes.func.isRequired,
    currentDeviceId: PropTypes.string.isRequired,
    selectNodeById: PropTypes.func.isRequired,
    loadCommands: PropTypes.func.isRequired,
    loadCommandsHistory: PropTypes.func.isRequired,
    commandsHistory: PropTypes.array
    // addDevice: PropTypes.func.isRequired,
    // creating: PropTypes.any,
    // failed: PropTypes.any,
    // success: PropTypes.any,
    // showModal: PropTypes.bool.isRequired,
    // hideModal: PropTypes.func.isRequired,
    // resetProcess: PropTypes.func.isRequired,
    // loadDevices: PropTypes.func.isRequired,
    // nodes: PropTypes.any
  };

  componentWillMount() {
    this.props.loadNodes();
    this.props.loadDevices();
    this.props.makeDeviceActive(this.props.currentDeviceId);
    this.props.loadCommands();
    this.props.loadCommandsHistory();
  }

  render() {
    return this.props.devicesLoading ? (
      <ProgressOverlay visible={true}>Loading device info...</ProgressOverlay>
    ) : this.props.currentDevice ? (
      <InternalPage
        title="Device details"
        headerComponent={
          <Row className="header-container-row">
            <Col className="text-left blue">
              <FontAwesome name="chevron-left" />
              &nbsp;
              <Link to="/devices">Back to Devices</Link>
            </Col>
          </Row>
        }
      >
        {this.renderDeviceDetails()}
        <CommandsTable />
        <br />
        <br />
        <br />
        <br />
        <br />
        <CommandHistoryTabe items={this.props.commandsHistory} />
      </InternalPage>
    ) : (
      <div className="full-size-container red">
        <span>No such device!</span>
        <FontAwesome name="exclamation-triangle" />
      </div>
    );
  }

  renderDeviceDetails() {
    return (
      <div className="info-container">
        <Row className="info-row">
          <Col className="info-col-name" md={3} xs={5}>
            Name:
          </Col>
          <Col className="info-col-value" md={9} xs={7}>
            {this.props.currentDevice.name
              ? this.props.currentDevice.name
              : "N/A"}
          </Col>
        </Row>
        <Row className="info-row">
          <Col className="info-col-name" md={3} xs={5}>
            Node:
          </Col>
          <Col className="info-col-value" md={9} xs={7}>
            {this.props.selectNodeById(this.props.currentDevice.nodeId)
              ? this.props.selectNodeById(this.props.currentDevice.nodeId).name
              : "N/A"}
          </Col>
        </Row>
        <Row className="info-row">
          <Col className="info-col-name" md={3} xs={5}>
            Pins:
          </Col>
          <Col className="info-col-value" md={9} xs={7}>
            {this.props.currentDevice.pins
              ? this.props.currentDevice.pins
              : "N/A"}
          </Col>
        </Row>
        <Row className="info-row">
          <Col className="info-col-name" md={3} xs={5}>
            Last command:
          </Col>
          <Col className="info-col-value" md={9} xs={7}>
            {/* {this.props.currentDevice.pins
              ? this.props.currentDevice.pins
              : "N/A"} */}
            N/A
          </Col>
        </Row>
        <Row className="info-row">
          <Col className="info-col-name" md={3} xs={5}>
            Last state:
          </Col>
          <Col className="info-col-value" md={9} xs={7}>
            {/* {this.props.currentDevice.pins
              ? this.props.currentDevice.pins
              : "N/A"} */}
            N/A
          </Col>
        </Row>
        {this.props.currentDevice.type === "INPUT" && (
          <Row className="info-row">
            <Col className="info-col-name" md={3} xs={5}>
              Current value:
            </Col>
            <Col className="info-col-value" md={9} xs={7}>
              {/* {this.props.currentDevice.pins
                ? this.props.currentDevice.pins
                : "N/A"} */}
              N/A
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const mapping = {
    currentDevice: DckSelectors.selectItemById(
      state,
      ItemTypes.Device,
      ownProps.match.params.id
    ),
    currentDeviceId: ownProps.match.params.id,
    selectNodeById: id =>
      DckSelectors.selectItemById(state, ItemTypes.Node, id),
    commandsHistory: DckSelectors.selectAllItems(
      state,
      ItemTypes.CommandHistory
    )
  };

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    loadDevices: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.Device)),
    loadNodes: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.Node)),
    loadCommands: () =>
      dispatch(DckActionCreators.itemsLoad(ItemTypes.Command)),
    makeDeviceActive: id =>
      dispatch(DckActionCreators.itemMakeActive(ItemTypes.Device, id)),
    loadCommandsHistory: () =>
      dispatch(DckActionCreators.itemsLoad(ItemTypes.CommandHistory))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeviceDetailPage);
