import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Row } from "react-bootstrap";

export class ModalWindow extends Component {
  static propTypes = {
    title: PropTypes.string,
    show: PropTypes.bool.isRequired,
    children: PropTypes.node,
    cancelButtonTitle: PropTypes.string,
    okButtonTitle: PropTypes.string,
    cancelButtonStyle: PropTypes.string,
    okButtonStyle: PropTypes.string,
    okButtonDisabled: PropTypes.bool,
    close: PropTypes.func,
    onOkClick: PropTypes.func,
    modalProps: PropTypes.any,
    onEnter: PropTypes.func,
    isCancelHide: PropTypes.bool,
    isOkHide: PropTypes.bool,
    footerClass: PropTypes.string,
    bodyClass: PropTypes.string,
    modalClass: PropTypes.string
  };

  render() {
    return (
      <div className="modal-container">
        <Modal
          show={this.props.show}
          onHide={this.props.close}
          onEnter={this.props.onEnter}
          className={this.props.modalClass}
        >
          <Modal.Header className="modal-dialog-close" closeButton>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body
            className={this.props.bodyClass ? this.props.bodyClass : ""}
          >
            {this.props.children}
          </Modal.Body>
          <Modal.Footer
            className={this.props.footerClass ? this.props.footerClass : ""}
          >
            <Row className="modal-dialog-footer">
              {!this.props.isOkHide ? (
                <Button
                  bsStyle="primary"
                  bsSize="large"
                  onClick={this.props.onOkClick}
                  disabled={this.props.okButtonDisabled}
                  className={
                    this.props.okButtonStyle
                      ? this.props.okButtonStyle
                      : "modal-dialog-ok-button"
                  }
                >
                  {this.props.okButtonTitle}
                </Button>
              ) : (
                ""
              )}
              {!this.props.isCancelHide ? (
                <Button
                  bsSize="large"
                  onClick={this.props.close}
                  className={
                    this.props.cancelButtonStyle
                      ? this.props.cancelButtonStyle
                      : "modal-dialog-cancel-button"
                  }
                >
                  Cancel
                </Button>
              ) : (
                ""
              )}
            </Row>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ModalWindow;
