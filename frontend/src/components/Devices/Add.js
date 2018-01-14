import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DckSelectors, DckActionCreators } from "dck-redux";

import * as ProcessTypes from "../../redux/processes/types";
import DeviceForm from "./Form";
import * as ItemTypes from "../../redux/items/types";

class AddNode extends Component {
  static propTypes = {
    addDevice: PropTypes.func.isRequired,
    creating: PropTypes.any,
    failed: PropTypes.any,
    success: PropTypes.any,
    showModal: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    resetProcess: PropTypes.func.isRequired,
    loadDevices: PropTypes.func.isRequired,
    nodes: PropTypes.any
  };

  render() {
    return (
      <div>
        <DeviceForm
          device={{}}
          nodes={this.props.nodes}
          onSaveClicked={data => this.props.addDevice(data)}
          failed={this.props.failed}
          processRunning={this.props.creating}
          processSuccess={this.props.success}
          hideModal={() => {
            this.props.resetProcess();
            this.props.hideModal();
          }}
          title="Add Device"
          show={this.props.showModal}
          onSuccess={() => {
            this.props.resetProcess();
            this.props.hideModal();
            this.props.loadDevices();
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const mapping = {
    creating: DckSelectors.selectProcessRunning(
      state,
      ProcessTypes.DEVICES_ADD
    ),
    failed: DckSelectors.selectProcessFailed(state, ProcessTypes.DEVICES_ADD),
    success: DckSelectors.selectProcessSuccess(state, ProcessTypes.DEVICES_ADD),
    nodes: DckSelectors.selectAllItems(state, ItemTypes.Node)
  };

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    addDevice: data =>
      dispatch(DckActionCreators.itemAdd(ItemTypes.Device, data)),
    resetProcess: () =>
      dispatch(DckActionCreators.asyncProcessReset(ProcessTypes.DEVICES_ADD)),
    loadDevices: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.Device))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNode);
