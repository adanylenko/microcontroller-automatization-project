import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { DckSelectors, DckActionCreators } from "dck-redux";

import * as ProcessTypes from "../../redux/processes/types";
import NodeForm from "./Form";
import * as ItemTypes from "../../redux/items/types";

class AddNode extends Component {
  static propTypes = {
    addNode: PropTypes.func.isRequired,
    creating: PropTypes.any,
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
        <NodeForm
          node={{}}
          onSaveClicked={data => this.props.addNode(data)}
          failed={this.props.failed}
          processRunning={this.props.creating}
          processSuccess={this.props.success}
          hideModal={() => {
            this.props.resetProcess();
            this.props.hideModal();
          }}
          title="Add Node"
          show={this.props.showModal}
          onSuccess={() => {
            this.props.resetProcess();
            this.props.hideModal();
            this.props.loadNodes();
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const mapping = {
    creating: DckSelectors.selectProcessRunning(state, ProcessTypes.NODES_ADD),
    failed: DckSelectors.selectProcessFailed(state, ProcessTypes.NODES_ADD),
    success: DckSelectors.selectProcessSuccess(state, ProcessTypes.NODES_ADD)
  };

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    addNode: data => dispatch(DckActionCreators.itemAdd(ItemTypes.Node, data)),
    resetProcess: () => {
      dispatch(DckActionCreators.asyncProcessReset(ProcessTypes.NODES_ADD));
    },
    loadNodes: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.Node))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNode);
