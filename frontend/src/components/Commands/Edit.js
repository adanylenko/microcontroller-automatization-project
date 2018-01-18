import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DckSelectors, DckActionCreators } from "dck-redux";

import * as ProcessTypes from "../../redux/processes/types";
import CommandForm from "./Form";
import * as ItemTypes from "../../redux/items/types";

class EditCommand extends Component {
  static propTypes = {
    currentItem: PropTypes.object,
    saveClick: PropTypes.func.isRequired,
    saving: PropTypes.any,
    failed: PropTypes.any,
    success: PropTypes.any,
    showModal: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    resetProcess: PropTypes.func.isRequired,
    loadNodes: PropTypes.func.isRequired,
    currentDevice: PropTypes.any
    // nodes: PropTypes.any
  };

  render() {
    return (
      <div>
        {this.props.currentItem ? (
          <CommandForm
            command={this.props.currentItem}
            device={this.props.currentDevice}
            onSaveClicked={data => this.props.saveClick(data)}
            failed={this.props.failed}
            processRunning={this.props.saving}
            processSuccess={this.props.success}
            hideModal={() => {
              this.props.resetProcess();
              this.props.hideModal();
            }}
            title="Edit Command"
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
    saving: DckSelectors.selectProcessRunning(
      state,
      ProcessTypes.COMMANDS_SAVE
    ),
    failed: DckSelectors.selectProcessFailed(state, ProcessTypes.COMMANDS_SAVE),
    success: DckSelectors.selectProcessSuccess(
      state,
      ProcessTypes.COMMANDS_SAVE
    ),
    currentItem: DckSelectors.selectActiveItem(state, ItemTypes.Command),
    currentDevice: DckSelectors.selectActiveItem(state, ItemTypes.Device)

    // nodes: DckSelectors.selectAllItems(state, ItemTypes.Node)
  };

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    saveClick: data =>
      dispatch(DckActionCreators.itemSave(ItemTypes.Command, data.id, data)),
    resetProcess: () => {
      dispatch(DckActionCreators.asyncProcessReset(ProcessTypes.COMMANDS_SAVE));
    },
    loadNodes: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.Command))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCommand);
