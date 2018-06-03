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

export class CommandHistoryTable extends Component {
  static propTypes = {
    makeItemActive: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="table-commandHistory-container">
        <span className="table-header">Commands history</span>
        <SmartTable
          className="command-history-table"
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
          hideButtons={true}
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  const mapping = {};

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    makeItemActive: id =>
      dispatch(DckActionCreators.itemMakeActive(ItemTypes.CommandHistory, id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(
  CommandHistoryTable
);
