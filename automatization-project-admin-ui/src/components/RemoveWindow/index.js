import React, { Component } from "react";
import { Button } from "react-bootstrap";
import PropTypes from "prop-types";

import ModalWindow from "../ModalWindow";

class RemoveWindow extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    delete: PropTypes.func.isRequired
  };

  render() {
    return (
      <ModalWindow
        title="Confirm remove"
        okButtonTitle="Remove"
        okButtonStyle="danger"
        show={this.props.show}
        cancelButtonStyle="remove-window-form-cancel-button"
        okButtonStyle="remove-window-form-ok-button"
        bodyClass="remove-window-form-body-class"
        close={() => {
          this.props.close();
        }}
        onOkClick={() => {
          this.props.delete();
          this.props.close();
        }}
      >
        <p>Are you sure you want to remove selected item?</p>
      </ModalWindow>
    );
  }
}

export default RemoveWindow;
