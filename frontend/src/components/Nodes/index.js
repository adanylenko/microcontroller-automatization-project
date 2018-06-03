import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { DckActionCreators, DckSelectors } from "dck-redux";
import { ProgressOverlay, InternalPage } from "dck-react-components";
import { TableHeaderColumn } from "react-bootstrap-table";
import * as FontAwesome from "react-fontawesome";

import * as ItemTypes from "../../redux/items/types";
import * as ProcessTypes from "../../redux/processes/types";
import SmartTable from "../SmartTable";

import NodeAdd from "./Add";
import NodeEdit from "./Edit";

export class Nodes extends Component {
  constructor(props) {
    super(props);

    this.state = { addNodeShow: false, editNodeShow: false };
  }

  static propTypes = {
    loadNodes: PropTypes.func.isRequired,
    nodesLoading: PropTypes.bool,
    nodes: PropTypes.array,
    makeNodeActive: PropTypes.func.isRequired,
    deleteNode: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.loadNodes();
  }

  render() {
    return this.props.nodesLoading ? (
      <ProgressOverlay visible={true}>Loading nodes...</ProgressOverlay>
    ) : (
      <InternalPage title="Nodes management">
        <SmartTable
          className="node-table"
          items={this.props.nodes ? this.props.nodes : []}
          loading={this.props.nodesLoading}
          selectedHandler={id => this.props.makeNodeActive(id)}
          editClick={() => this.setState({ editNodeShow: true })}
          addClick={() => this.setState({ addNodeShow: true })}
          deleteClick={node => this.props.deleteNode(node.id)}
          removeProcessFailed={this.props.deleteFailed}
          removeProcessRunning={this.props.deleting}
          removeProcessSuccess={this.props.deleteSuccess}
          onSuccessRemove={() => {
            this.props.resetDeletingProcess();
            this.props.loadNodes();
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
            dataField="url"
            dataAlign="center"
            filter={{ type: "TextFilter", defaultValue: "" }}
          >
            Url
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
            dataField="online"
            dataAlign="center"
            filter={{
              type: "SelectFilter",
              options: { true: "Yes", false: "No" }
            }}
            dataFormat={(cell, x) => (
              <span>
                <FontAwesome
                  name="circle"
                  className={
                    x.online || x.name.match("^test1") ? "green" : "red"
                  }
                />
              </span>
            )}
          >
            Is online?
          </TableHeaderColumn>
        </SmartTable>
        <NodeAdd
          showModal={this.state.addNodeShow}
          hideModal={() => this.setState({ addNodeShow: false })}
        />
        <NodeEdit
          showModal={this.state.editNodeShow}
          hideModal={() => this.setState({ editNodeShow: false })}
        />
      </InternalPage>
    );
  }
}

const mapStateToProps = state => {
  const mapping = {
    nodesLoading: DckSelectors.selectProcessRunning(
      state,
      ProcessTypes.NODES_LOAD
    ),
    nodes: DckSelectors.selectAllItems(state, ItemTypes.Node),
    deleting: DckSelectors.selectProcessRunning(
      state,
      ProcessTypes.NODES_REMOVE
    ),
    deleteFailed: DckSelectors.selectProcessFailed(
      state,
      ProcessTypes.NODES_REMOVE
    ),
    deleteSuccess: DckSelectors.selectProcessSuccess(
      state,
      ProcessTypes.NODES_REMOVE
    )
  };

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    loadNodes: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.Node)),
    makeNodeActive: id =>
      dispatch(DckActionCreators.itemMakeActive(ItemTypes.Node, id)),
    deleteNode: id =>
      dispatch(DckActionCreators.itemRemove(ItemTypes.Node, id)),
    resetDeletingProcess: () => {
      dispatch(DckActionCreators.asyncProcessReset(ProcessTypes.NODES_REMOVE));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Nodes);
