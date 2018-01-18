import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DckSelectors, DckActionCreators } from "dck-redux";

import * as ProcessTypes from "../../redux/processes/types";
import CommandForm from "./Form";
import * as ItemTypes from "../../redux/items/types";

class AddCommand extends Component {
  static propTypes = {
    addClick: PropTypes.func.isRequired,
    creating: PropTypes.any,
    failed: PropTypes.any,
    success: PropTypes.any,
    showModal: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    resetProcess: PropTypes.func.isRequired,
    loadItems: PropTypes.func.isRequired,
    currentDevice: PropTypes.any
  };

  render() {
    return (
      <div>
        <CommandForm
          command={{}}
          device={this.props.currentDevice}
          onSaveClicked={data => this.props.addClick(data)}
          failed={this.props.failed}
          processRunning={this.props.creating}
          processSuccess={this.props.success}
          hideModal={() => {
            this.props.resetProcess();
            this.props.hideModal();
          }}
          title="Add Command"
          show={this.props.showModal}
          onSuccess={() => {
            this.props.resetProcess();
            this.props.hideModal();
            this.props.loadItems();
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
      ProcessTypes.COMMANDS_ADD
    ),
    failed: DckSelectors.selectProcessFailed(state, ProcessTypes.COMMANDS_ADD),
    success: DckSelectors.selectProcessSuccess(
      state,
      ProcessTypes.COMMANDS_ADD
    ),
    currentDevice: DckSelectors.selectActiveItem(state, ItemTypes.Device)
  };

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    addClick: data =>
      dispatch(DckActionCreators.itemAdd(ItemTypes.Command, data)),
    resetProcess: () =>
      dispatch(DckActionCreators.asyncProcessReset(ProcessTypes.COMMANDS_ADD)),
    loadItems: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.Command))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddCommand);
