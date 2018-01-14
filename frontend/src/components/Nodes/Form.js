import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert } from "react-bootstrap";

import { FieldGroup } from "dck-react-components";
import { nonEmpty } from "dck-validators";

import initField from "../../utils/form-builder";
import ModalDialog from "../ModalWindow";

class NodeForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitState();
  }

  static propTypes = {
    node: PropTypes.object.isRequired,
    onSaveClicked: PropTypes.func.isRequired,
    failed: PropTypes.any,
    processRunning: PropTypes.any,
    processSuccess: PropTypes.any,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired
  };

  componentWillReceiveProps(newProps) {
    if (newProps.processSuccess && newProps.show) {
      this.props.onSuccess();
    }
  }

  getInitState() {
    const isNew = !!this.props.node.id;

    return {
      isNew: isNew,
      ...initField(
        this,
        "node_url",
        this.props.node.url ? this.props.node.url : "",
        nonEmpty,
        isNew
      ),
      ...initField(
        this,
        "node_name",
        this.props.node.name ? this.props.node.name : "",
        nonEmpty,
        isNew
      )
    };
  }

  valid() {
    return !!(
      this.state.node_url.validation &&
      this.state.node_url.validation.valid &&
      this.state.node_name.validation &&
      this.state.node_name.validation.valid
    );
  }

  saveClicked() {
    this.state.node_name.validationCurrentValue();
    this.state.node_url.validationCurrentValue();

    if (this.valid() && !this.props.processRunning) {
      this.props.onSaveClicked({
        id: this.props.node.id,
        url: this.state.node_url.value,
        name: this.state.node_name.value
      });
    }
  }

  render() {
    return (
      <ModalDialog
        title={this.props.title}
        okButtonTitle={this.props.node.id ? "Edit Node" : "Add Node"}
        show={this.props.show}
        cancelButtonStyle="node-form-cancel-button"
        okButtonStyle="node-form-ok-button"
        bodyClass="node-form-body-class"
        okButtonDisabled={this.props.processRunning}
        close={() => {
          this.props.hideModal();
        }}
        onOkClick={() => {
          this.saveClicked();
        }}
        onEnter={() => {
          const initState = this.getInitState();
          this.setState(initState);

          if (this.props.node.id) {
            this.state.node_name.setValue(
              this.props.node.name ? this.props.node.name : ""
            );
            this.state.node_url.setValue(
              this.props.node.url ? this.props.node.url : ""
            );
          }
        }}
      >
        <form
          className="node-form"
          onSubmit={e => {
            e.preventDefault();
            this.saveClicked();
            this.props.hideModal();
          }}
        >
          <FieldGroup
            id="node_url"
            type="text"
            label="Node url"
            placeholder="Enter node url"
            value={this.state.node_url.value}
            onChange={this.state.node_url.onChange}
            validationState={this.state.node_url.validation}
            validationMessage="Node url must not be empty"
            bsClass="item-form-control form-control"
          />

          <FieldGroup
            id="node_name"
            type="text"
            label="Node name"
            placeholder="Enter node name"
            value={this.state.node_name.value}
            onChange={this.state.node_name.onChange}
            validationState={this.state.node_name.validation}
            validationMessage="Node name must not be empty"
            bsClass="item-form-control form-control"
          />
        </form>

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
      </ModalDialog>
    );
  }
}

export default NodeForm;
