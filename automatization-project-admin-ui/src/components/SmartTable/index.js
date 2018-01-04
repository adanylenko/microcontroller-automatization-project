import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col } from "react-bootstrap";
import { BootstrapTable } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";

class SmartTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showRemoveModal: false,
      selected: {}
    };
  }

  getSelectedItems() {
    let itemsArray = [];
    const selectionState = this.state.selected;

    for (let key in selectionState) {
      if (selectionState.hasOwnProperty(key)) {
        itemsArray.push(selectionState[key]);
      }
    }

    return itemsArray;
  }

  renderContent() {
    return (
      <Col md={12}>
        <BootstrapTable
          className="smart-table-info"
          data={this.props.items}
          striped={true}
          hover={true}
          bordered={true}
          condensed={true}
          responsive={true}
        >
          {this.props.children}
        </BootstrapTable>
        <br />
      </Col>
    );
  }

  render() {
    return (
      <Grid bsClass="container-fluid">
        <Row bsClass="smart-table-row">
          {this.props.loading ? (
            <Col md={12}>Loading...</Col>
          ) : (
            this.renderContent()
          )}
        </Row>
      </Grid>
    );
  }
}

SmartTable.propTypes = {
  loading: PropTypes.bool,
  children: PropTypes.node,
  items: PropTypes.array.isRequired
};

export default SmartTable;
