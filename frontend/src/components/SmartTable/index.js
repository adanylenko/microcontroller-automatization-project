import React, { Component } from "react";
import PropTypes from "prop-types";
import { Grid, Row, Col, Button, ButtonToolbar } from "react-bootstrap";
import { BootstrapTable } from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table.min.css";

import RemoveWindow from "../RemoveWindow";

class SmartTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showRemoveModal: false,
      itemSelected: false,
      selectedRow: { id: null },
      selectRowProp: {
        mode: "radio",
        clickToSelect: true,
        hideSelectColumn: true,
        bgColor: "#337ab7",
        onSelect: (row, isSelected, e) => this.onRowSelect(row, isSelected, e)
      }
    };
  }

  onRowSelect(row, isSelected, e) {
    if (isSelected === true) {
      this.setState({
        selectedRow: row
      });
      this.props.selectedHandler(row.id);
    }
    this.setState({ itemSelected: isSelected });
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
          pagination
          selectRow={this.state.selectRowProp}
          // height="345px"
        >
          {this.props.children}
        </BootstrapTable>
        <br />
        {!this.props.hideButtons && (
          <ButtonToolbar className="tableToolbar">
            {this.props.addClick && (
              <Button bsStyle="primary" onClick={() => this.props.addClick()}>
                Add
              </Button>
            )}
            {this.props.editClick && (
              <Button
                bsStyle="default"
                onClick={() => this.props.editClick()}
                disabled={!this.state.itemSelected}
              >
                Edit
              </Button>
            )}
            {this.props.deleteClick &&
              this.props.onSuccessRemove && (
                <Button
                  bsStyle="danger"
                  onClick={() => this.setState({ showRemoveModal: true })}
                  disabled={!this.state.itemSelected}
                >
                  Remove
                </Button>
              )}
          </ButtonToolbar>
        )}
        {this.props.deleteClick &&
          this.props.onSuccessRemove && (
            <RemoveWindow
              show={this.state.showRemoveModal}
              close={() => this.setState({ showRemoveModal: false })}
              title="Delete item"
              delete={() => this.props.deleteClick(this.state.selectedRow)}
              failed={this.props.removeProcessFailed}
              processRunning={this.props.removeProcessRunning}
              processSuccess={this.props.removeProcessSuccess}
              onSuccess={() => {
                this.setState({ showRemoveModal: false });
                this.props.onSuccessRemove();
              }}
            />
          )}
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
  items: PropTypes.array.isRequired,
  selectedHandler: PropTypes.func.isRequired,
  addClick: PropTypes.func,
  editClick: PropTypes.func,
  deleteClick: PropTypes.func,
  removeProcessFailed: PropTypes.any,
  removeProcessRunning: PropTypes.any,
  removeProcessSuccess: PropTypes.any,
  onSuccessRemove: PropTypes.func,
  hideButtons: PropTypes.bool
};

export default SmartTable;
