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

import CommandAdd from "./Add";
import CommandEdit from "./Edit";

export class CommandsTable extends Component {
  constructor(props) {
    super(props);

    this.state = { addShow: false, editShow: false };
  }

  static propTypes = {
    loadCommands: PropTypes.func.isRequired,
    loadStates: PropTypes.func.isRequired,
    commands: PropTypes.array,
    makeCommandActive: PropTypes.func.isRequired,
    deleteCommand: PropTypes.func.isRequired,
    itemsLoading: PropTypes.any,
    deleteFailed: PropTypes.any,
    deleteSuccess: PropTypes.any,
    resetDeletingProcess: PropTypes.any
  };

  render() {
    return (
      <div className="table-container">
        <span className="table-header">Commands</span>
        <SmartTable
          className="command-table"
          items={this.props.commands ? this.props.commands : []}
          loading={this.props.itemsLoading}
          selectedHandler={id => this.props.makeCommandActive(id)}
          editClick={() => this.setState({ editShow: true })}
          addClick={() => this.setState({ addShow: true })}
          deleteClick={command => this.props.deleteCommand(command.id)}
          removeProcessFailed={this.props.deleteFailed}
          removeProcessRunning={this.props.deleting}
          removeProcessSuccess={this.props.deleteSuccess}
          onSuccessRemove={() => {
            this.props.resetDeletingProcess();
            this.props.loadCommands();
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
            filter={{ type: "TextFilter", defaultValue: "" }}
          >
            Name
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="type"
            dataAlign="center"
            dataSort={true}
            filter={{
              type: "SelectFilter",
              options: { INPUT: "INPUT", OUTPUT: "OUTPUT" }
            }}
          >
            Type
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="pins"
            dataAlign="center"
            filter={{ type: "TextFilter", defaultValue: "" }}
          >
            Pin
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="currentState"
            dataAlign="center"
            dataFormat={(cell, x) => (
              <Link
                to="#"
                className="link-details"
                onClick={e => {
                  console.log("Click");
                  this.props.makeCommandActive(x.id);
                  this.props.loadStates();
                }}
              >
                {x.currentState ? x.currentState : "N/A"}&nbsp;<FontAwesome name="chevron-right" />
              </Link>
            )}
          >
            Current state
          </TableHeaderColumn>
        </SmartTable>
        <CommandAdd
          showModal={this.state.addShow}
          hideModal={() => this.setState({ addShow: false })}
        />
        <CommandEdit
          showModal={this.state.editShow}
          hideModal={() => this.setState({ editShow: false })}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const mapping = {
    itemsLoading: DckSelectors.selectProcessRunning(
      state,
      ProcessTypes.COMMANDS_LOAD
    ),
    commands: DckSelectors.selectAllItems(state, ItemTypes.Command),
    deleting: DckSelectors.selectProcessRunning(
      state,
      ProcessTypes.COMMANDS_REMOVE
    ),
    deleteFailed: DckSelectors.selectProcessFailed(
      state,
      ProcessTypes.COMMANDS_REMOVE
    ),
    deleteSuccess: DckSelectors.selectProcessSuccess(
      state,
      ProcessTypes.COMMANDS_REMOVE
    )
  };

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    loadCommands: () =>
      dispatch(DckActionCreators.itemsLoad(ItemTypes.Command)),
    loadStates: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.State)),
    makeCommandActive: id =>
      dispatch(DckActionCreators.itemMakeActive(ItemTypes.Command, id)),
    deleteCommand: id =>
      dispatch(DckActionCreators.itemRemove(ItemTypes.Command, id)),
    resetDeletingProcess: () => {
      dispatch(
        DckActionCreators.asyncProcessReset(ProcessTypes.COMMANDS_REMOVE)
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommandsTable);
