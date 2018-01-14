import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Alert,
  FormGroup,
  ControlLabel,
  HelpBlock
} from "react-bootstrap";

import { FieldGroup } from "dck-react-components";
import { nonEmpty } from "dck-validators";
import Select from "react-select";
import * as FontAwesome from "react-fontawesome";

import initField from "../../utils/form-builder";
import ModalDialog from "../ModalWindow";

class DeviceForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitState();
  }

  static propTypes = {
    device: PropTypes.object.isRequired,
    onSaveClicked: PropTypes.func.isRequired,
    failed: PropTypes.any,
    processRunning: PropTypes.any,
    processSuccess: PropTypes.any,
    hideModal: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
    nodes: PropTypes.array
  };

  componentWillReceiveProps(newProps) {
    if (newProps.processSuccess && newProps.show) {
      this.props.onSuccess();
    }
  }

  getInitState() {
    const isNew = !!this.props.device.id;

    return {
      isNew: isNew,
      ...initField(
        this,
        "name",
        this.props.device.name ? this.props.device.name : "",
        nonEmpty,
        isNew
      ),
      ...initField(
        this,
        "pins",
        this.props.device.pins ? this.props.device.pins : "",
        nonEmpty,
        isNew
      ),
      ...initField(
        this,
        "type",
        this.props.device.type ? this.props.device.type : "",
        nonEmpty,
        isNew
      ),
      ...initField(
        this,
        "node_id",
        this.props.device.nodeId ? this.props.device.nodeId : "",
        nonEmpty,
        isNew
      )
    };
  }

  valid() {
    return !!(
      this.state.name.validation &&
      this.state.name.validation.valid &&
      this.state.pins.validation &&
      this.state.pins.validation.valid &&
      this.state.type.validation &&
      this.state.type.validation.valid &&
      this.state.node_id.validation &&
      this.state.node_id.validation.valid
    );
  }

  saveClicked() {
    this.state.name.validationCurrentValue();
    this.state.pins.validationCurrentValue();
    this.state.type.validationCurrentValue();
    this.state.node_id.validationCurrentValue();

    if (this.valid() && !this.props.processRunning) {
      this.props.onSaveClicked({
        id: this.props.device.id,
        name: this.state.name.value,
        pins: this.state.pins.value,
        type: this.state.type.value,
        nodeId: this.state.node_id.value
      });
    }
  }

  render() {
    return (
      <ModalDialog
        title={this.props.title}
        okButtonTitle={this.props.device.id ? "Edit Device" : "Add Device"}
        show={this.props.show}
        cancelButtonStyle="device-form-cancel-button"
        okButtonStyle="device-form-ok-button"
        bodyClass="device-form-body-class"
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

          if (this.props.device.id) {
            this.state.name.setValue(
              this.props.device.name ? this.props.device.name : ""
            );
            this.state.pins.setValue(
              this.props.device.pins ? this.props.device.pins : ""
            );
            this.state.type.setValue(
              this.props.device.type ? this.props.device.type : ""
            );
            this.state.node_id.setValue(
              this.props.device.node_id ? this.props.device.node_id : ""
            );
          }
        }}
      >
        <form
          className="device-form"
          onSubmit={e => {
            e.preventDefault();
            this.saveClicked();
            this.props.hideModal();
          }}
        >
          <FieldGroup
            id="name"
            type="text"
            label="Device name"
            placeholder="Enter device name"
            value={this.state.name.value}
            onChange={this.state.name.onChange}
            validationState={this.state.name.validation}
            validationMessage="Device name must not be empty"
            bsClass="item-form-control form-control"
          />

          <FormGroup
            controlId="node-select"
            validationState={
              this.state.node_id &&
              this.state.node_id.validation &&
              this.state.node_id.validation.valid
                ? "success"
                : "error"
            }
          >
            <ControlLabel>Device node</ControlLabel>
            <Select
              className="react-select"
              placeholder="Select node"
              value={this.state.node_id.value}
              clearable={false}
              searchable={true}
              options={
                this.props.nodes
                  ? this.props.nodes.map(item => ({
                      label: item.name,
                      value: item.id
                    }))
                  : []
              }
              onChange={event =>
                event ? this.state.node_id.setValue(event.value) : ""
              }
              // arrowRenderer={this.arrowRender}
            />{" "}
            {this.props.help && <HelpBlock>{this.props.help}</HelpBlock>}
            {this.props.validationMessage &&
            this.props.validationState &&
            !this.props.validationState.valid ? (
              <HelpBlock>
                <FontAwesome name="exclamation-circle" />&nbsp;
                {this.props.validationMessage}
              </HelpBlock>
            ) : (
              <HelpBlock>&nbsp;</HelpBlock>
            )}
          </FormGroup>

          {/* <FieldGroup
            id="node_name"
            type="text"
            label="Node name"
            placeholder="Enter device name"
            value={this.state.node_name.value}
            onChange={this.state.node_name.onChange}
            validationState={this.state.node_name.validation}
            validationMessage="Node name must not be empty"
            bsClass="item-form-control form-control"
          /> */}
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

export default DeviceForm;
