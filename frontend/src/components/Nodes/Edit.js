import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DckSelectors, DckActionCreators } from "dck-redux";

import * as ProcessTypes from "../../redux/processes/types";
import NodeForm from "./Form";
import * as ItemTypes from "../../redux/items/types";

class EditNode extends Component {
  static propTypes = {
    currentNode: PropTypes.object,
    saveNode: PropTypes.func.isRequired,
    saving: PropTypes.any,
    failed: PropTypes.any,
    success: PropTypes.any,
    showModal: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    resetProcess: PropTypes.func.isRequired,
    loadNodes: PropTypes.func.isRequired
  };

  render() {
    return (
      <div>
        {this.props.currentNode ? (
          <NodeForm
            node={this.props.currentNode}
            onSaveClicked={data => this.props.saveNode(data)}
            failed={this.props.failed}
            processRunning={this.props.saving}
            processSuccess={this.props.success}
            hideModal={() => {
              this.props.resetProcess();
              this.props.hideModal();
            }}
            title="Edit Node"
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
    saving: DckSelectors.selectProcessRunning(state, ProcessTypes.NODES_SAVE),
    failed: DckSelectors.selectProcessFailed(state, ProcessTypes.NODES_SAVE),
    success: DckSelectors.selectProcessSuccess(state, ProcessTypes.NODES_SAVE),
    currentNode: DckSelectors.selectActiveItem(state, ItemTypes.Node)
  };

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    saveNode: data =>
      dispatch(DckActionCreators.itemSave(ItemTypes.Node, data.id, data)),
    resetProcess: () => {
      dispatch(DckActionCreators.asyncProcessReset(ProcessTypes.NODES_SAVE));
    },
    loadNodes: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.Node))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditNode);
