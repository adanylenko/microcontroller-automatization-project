import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DckSelectors, DckActionCreators } from "dck-redux";

import * as ProcessTypes from "../../redux/processes/types";
import DeviceForm from "./Form";
import * as ItemTypes from "../../redux/items/types";

class EditDevice extends Component {
  static propTypes = {
    currentDevice: PropTypes.object,
    saveDevice: PropTypes.func.isRequired,
    saving: PropTypes.any,
    failed: PropTypes.any,
    success: PropTypes.any,
    showModal: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    resetProcess: PropTypes.func.isRequired,
    loadNodes: PropTypes.func.isRequired,
    nodes: PropTypes.any
  };

  render() {
    return (
      <div>
        {this.props.currentDevice ? (
          <DeviceForm
            device={this.props.currentDevice}
            nodes={this.props.nodes}
            onSaveClicked={data => this.props.saveDevice(data)}
            failed={this.props.failed}
            processRunning={this.props.saving}
            processSuccess={this.props.success}
            hideModal={() => {
              this.props.resetProcess();
              this.props.hideModal();
            }}
            title="Edit Device"
            show={this.props.showModal}
            onSuccess={() => {
              this.props.resetProcess();
              this.props.hideModal();
              this.props.loadNodes();
            }}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const mapping = {
    saving: DckSelectors.selectProcessRunning(state, ProcessTypes.DEVICES_SAVE),
    failed: DckSelectors.selectProcessFailed(state, ProcessTypes.DEVICES_SAVE),
    success: DckSelectors.selectProcessSuccess(
      state,
      ProcessTypes.DEVICES_SAVE
    ),
    currentDevice: DckSelectors.selectActiveItem(state, ItemTypes.Device),
    nodes: DckSelectors.selectAllItems(state, ItemTypes.Node)
  };

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    saveDevice: data =>
      dispatch(DckActionCreators.itemSave(ItemTypes.Device, data.id, data)),
    resetProcess: () => {
      dispatch(DckActionCreators.asyncProcessReset(ProcessTypes.DEVICES_SAVE));
    },
    loadNodes: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.Device))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditDevice);
