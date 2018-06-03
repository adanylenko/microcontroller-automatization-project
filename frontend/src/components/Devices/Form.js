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
        this.separatedNumber,
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

  separatedNumber(value) {
    return new Promise((resolve, reject) => {
      let empty = false;

      let valid = false;

      if (!value || value.trim().length === 0) {
        empty = true;
      } else {
        if (value.match(new RegExp("^[1-9][0-9]*(,[0-9]+)*$", "g"))) {
          valid = true;
        }
      }
      resolve({ valid, empty });
    });
  }

  valid() {
    return !!(
      this.state.name.validation &&
      this.state.name.validation.valid &&
      this.state.pins.validation &&
      this.state.pins.validation.valid &&
      this.state.node_id.validation &&
      this.state.node_id.validation.valid
    );
  }

  saveClicked() {
    this.state.name.validationCurrentValue();
    this.state.pins.validationCurrentValue();
    this.state.node_id.validationCurrentValue();

    if (this.valid() && !this.props.processRunning) {
      this.props.onSaveClicked({
        id: this.props.device.id,
        name: this.state.name.value,
        pins: this.state.pins.value,
        nodeId: this.state.node_id.value
      });
    }
  }

  getValidationState(validation) {
    if (!validation) {
      return null;
    }

    if (validation.valid) {
      return "success";
    } else {
      return "error";
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
            this.state.node_id.setValue(
              this.props.device.nodeId ? this.props.device.nodeId : ""
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
            validationState={this.getValidationState(
              this.state.node_id.validation
            )}
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
            />
            {this.state.node_id.validation &&
            !this.state.node_id.validation.valid ? (
              <HelpBlock>
                <FontAwesome name="exclamation-circle" />&nbsp; Select device
                node
              </HelpBlock>
            ) : (
              <HelpBlock>&nbsp;</HelpBlock>
            )}
          </FormGroup>

          <FieldGroup
            id="pins"
            type="text"
            label="Device pins"
            placeholder="Enter device pins"
            value={this.state.pins.value}
            onChange={this.state.pins.onChange}
            validationState={this.state.pins.validation}
            validationMessage="Device pins must not be empty"
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

export default DeviceForm;
