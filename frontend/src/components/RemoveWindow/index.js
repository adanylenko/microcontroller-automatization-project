import React, { Component } from "react";
import { Alert } from "react-bootstrap";
import PropTypes from "prop-types";

import ModalWindow from "../ModalWindow";

class RemoveWindow extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    delete: PropTypes.func.isRequired,
    failed: PropTypes.any,
    processRunning: PropTypes.any,
    processSuccess: PropTypes.any,
    onSuccess: PropTypes.func.isRequired
  };

  componentWillReceiveProps(newProps) {
    if (newProps.processSuccess && newProps.show) {
      this.props.onSuccess();
    }
  }

  render() {
    return (
      <ModalWindow
        title="Confirm remove"
        okButtonTitle="Remove"
        okButtonStyle="danger"
        show={this.props.show}
        cancelButtonStyle="remove-window-form-cancel-button"
        bodyClass="remove-window-form-body-class"
        close={() => {
          this.props.close();
        }}
        onOkClick={() => {
          this.props.delete();
        }}
      >
        <p>Are you sure you want to remove selected item?</p>
        {this.props.processRunning && (
          <Alert bsStyle="warning" bsClass="external-page-alert alert">
            <strong>Operation pending</strong>
            <br /> Please wait...
          </Alert>
        )}

        {this.props.failed && (
          <Alert bsStyle="warning" bsClass="external-page-alert alert">
            <strong>Operation failed!</strong>
            <br />
            Please check the data and try again
          </Alert>
        )}
      </ModalWindow>
    );
  }
}

export default RemoveWindow;
