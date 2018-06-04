import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { DckActionCreators, DckSelectors } from "dck-redux";
import { ProgressOverlay, InternalPage } from "dck-react-components";
import { TableHeaderColumn } from "react-bootstrap-table";
import * as FontAwesome from "react-fontawesome";
import { Link } from "react-router-dom";

import * as ItemTypes from "../../redux/items/types";
import * as ProcessTypes from "../../redux/processes/types";
import SmartTable from "../SmartTable";

import DeviceAdd from "./Add";
import DeviceEdit from "./Edit";

export class Devices extends Component {
  constructor(props) {
    super(props);

    this.state = { addModalShow: false, editModalShow: false };
  }

  static propTypes = {
    loadDevices: PropTypes.func.isRequired,
    devicesLoading: PropTypes.bool,
    devices: PropTypes.array,
    makeDeviceActive: PropTypes.func.isRequired,
    deleteDevice: PropTypes.func.isRequired,
    getNodeById: PropTypes.func.isRequired,
    loadNodes: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.loadNodes();
    this.props.loadDevices();
  }

  getNodeName(nodeId) {
    if (!nodeId) {
      return "undefined";
    }

    const node = this.props.getNodeById(nodeId);

    return node && node.name ? node.name : nodeId;
  }

  render() {
    return this.props.devicesLoading ? (
      <ProgressOverlay visible={true}>Loading devices...</ProgressOverlay>
    ) : (
      <InternalPage title="Devices management">
        <SmartTable
          className="devices-table"
          items={this.props.devices ? this.props.devices : []}
          loading={this.props.devicesLoading}
          selectedHandler={id => this.props.makeDeviceActive(id)}
          editClick={() => this.setState({ editModalShow: true })}
          addClick={() => this.setState({ addModalShow: true })}
          deleteClick={device => this.props.deleteDevice(device.id)}
          removeProcessFailed={this.props.deleteFailed}
          removeProcessRunning={this.props.deleting}
          removeProcessSuccess={this.props.deleteSuccess}
          onSuccessRemove={() => {
            this.props.resetDeletingProcess();
            this.props.loadDevices();
          }}
        >
          <TableHeaderColumn
            dataField="id"
            dataAlign="center"
            isKey={true}
            hidden
          >
            Id
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="name"
            dataAlign="center"
            dataSort={true}
            filter={{ type: "TextFilter", defaultValue: "" }}
          >
            Name
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="nodeId"
            dataAlign="center"
            dataSort={true}
            filter={{ type: "TextFilter", defaultValue: "" }}
            dataFormat={(cell, x) => this.getNodeName(x.nodeId)}
          >
            Node name
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="pins"
            dataAlign="center"
            filter={{ type: "TextFilter", defaultValue: "" }}
          >
            Pins
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="id"
            dataAlign="center"
            dataFormat={(cell, x) => (
              <Link to={`/device/${x.id}`} className="link-details">
                Details&nbsp;<FontAwesome name="chevron-right" />
              </Link>
            )}
          />
        </SmartTable>
        <DeviceAdd
          showModal={this.state.addModalShow}
          hideModal={() => this.setState({ addModalShow: false })}
        />
        <DeviceEdit
          showModal={this.state.editModalShow}
          hideModal={() => this.setState({ editModalShow: false })}
        />
      </InternalPage>
    );
  }
}

const mapStateToProps = state => {
  const mapping = {
    devicesLoading: DckSelectors.selectProcessRunning(
      state,
      ProcessTypes.DEVICES_LOAD
    ),
    devices: DckSelectors.selectAllItems(state, ItemTypes.Device),
    deleting: DckSelectors.selectProcessRunning(
      state,
      ProcessTypes.DEVICES_REMOVE
    ),
    deleteFailed: DckSelectors.selectProcessFailed(
      state,
      ProcessTypes.DEVICES_REMOVE
    ),
    deleteSuccess: DckSelectors.selectProcessSuccess(
      state,
      ProcessTypes.DEVICES_REMOVE
    ),
    getNodeById: nodeId =>
      DckSelectors.selectItemById(state, ItemTypes.Node, nodeId)
  };

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    loadNodes: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.Node)),
    loadDevices: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.Device)),
    makeDeviceActive: id =>
      dispatch(DckActionCreators.itemMakeActive(ItemTypes.Device, id)),
    deleteDevice: id =>
      dispatch(DckActionCreators.itemRemove(ItemTypes.Device, id)),
    resetDeletingProcess: () => {
      dispatch(
        DckActionCreators.asyncProcessReset(ProcessTypes.DEVICES_REMOVE)
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Devices);
