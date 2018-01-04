import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { DckActionCreators, DckSelectors } from "dck-redux";
import { ProgressOverlay, InternalPage } from "dck-react-components";
import { TableHeaderColumn } from "react-bootstrap-table";
import { NavLink } from "react-router-dom";
//import * as FontAwesome from "react-fontawesome";

import * as ItemTypes from "../../redux/items/types";
import * as ProcessTypes from "../../redux/processes/types";
import SmartTable from "../SmartTable";

export class Nodes extends Component {
  static propTypes = {
    loadNodes: PropTypes.func.isRequired,
    nodesLoading: PropTypes.bool,
    nodes: PropTypes.array,
    addNode: PropTypes.func.isRequired,
    editNode: PropTypes.func.isRequired
  };

  componentWillMount() {
    this.props.loadNodes();
  }

  render() {
    return this.props.nodesLoading ? (
      <ProgressOverlay visible={true}>Loading nodes...</ProgressOverlay>
    ) : (
      <InternalPage
        title="Nodes management"
        headerComponent={
          <span className="text-right">
            <a
              className="button-link text-right"
              onClick={() => {
                console.log;
              }}
            >
              Add Node
            </a>
          </span>
        }
      >
        <SmartTable
          className="add-new-location"
          items={this.props.nodes ? this.props.nodes : []}
          loading={this.props.nodesLoading}
        >
          <TableHeaderColumn dataField="id" dataAlign="center" isKey={true}>
            Id
          </TableHeaderColumn>
          <TableHeaderColumn dataField="url" dataAlign="center">
            Url
          </TableHeaderColumn>
          <TableHeaderColumn dataField="name" dataAlign="center">
            Name
          </TableHeaderColumn>
          {
            //<TableHeaderColumn
            //dataField="edit"
            //dataAlign="center"
            //dataFormat={(cell, x) => (
            //  <a
            //    className="button-link"
            //    onClick={() => {
            //      console.log("edit");
            //    }}
            //  >
            //    Edit
            //  </a>
            //)}
            //>
            // Is online?
            //</TableHeaderColumn>
          }
          <TableHeaderColumn
            dataField="edit"
            dataAlign="center"
            dataFormat={(cell, x) => (
              <a
                className="button-link"
                onClick={() => {
                  console.log("edit");
                }}
              >
                Edit
              </a>
            )}
          />
        </SmartTable>
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
    nodes: DckSelectors.selectAllItems(state, ItemTypes.Node)
  };

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    loadNodes: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.Node)),
    addNode: data => {
      console.log("add node=", data);
    },
    editNode: data => {
      console.log("edit node=", data);
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Nodes);
