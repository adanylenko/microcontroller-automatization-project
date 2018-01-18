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

class CommandForm extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitState();

    console.log("device=", this.props.device);
  }

  static propTypes = {
    command: PropTypes.object.isRequired,
    device: PropTypes.object,
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
    const isNew = !!this.props.command.id;

    return {
      isNew: isNew,
      ...initField(
        this,
        "name",
        this.props.command.name ? this.props.command.name : "",
        nonEmpty,
        isNew
      ),
      ...initField(
        this,
        "pins",
        this.props.command.pins ? this.props.command.pins : "",
        this.arrayCheck,
        isNew
      ),
      ...initField(
        this,
        "type",
        this.props.command.type ? this.props.command.type : "",
        nonEmpty,
        isNew
      )
    };
  }

  arrayCheck(value) {
    return new Promise((resolve, reject) => {
      let empty = false;

      let valid = false;

      if (!value || value.length === 0) {
        empty = true;
      } else {
        if (value.length) {
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
      this.state.type.validation &&
      this.state.type.validation.valid
    );
  }

  saveClicked() {
    this.state.name.validationCurrentValue();
    this.state.pins.validationCurrentValue();
    this.state.type.validationCurrentValue();

    if (this.valid() && !this.props.processRunning) {
      this.props.onSaveClicked({
        id: this.props.command.id,
        name: this.state.name.value,
        pins:
          this.state.pins.value && this.state.pins.value.length
            ? this.state.pins.value.map(item => item.value).join(",")
            : "",
        type: this.state.type.value,
        deviceId: this.props.device.id
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
        okButtonTitle={this.props.command.id ? "Edit Command" : "Add Command"}
        show={this.props.show}
        cancelButtonStyle="command-form-cancel-button"
        okButtonStyle="command-form-ok-button"
        bodyClass="command-form-body-class"
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

          if (this.props.command.id) {
            this.state.name.setValue(
              this.props.command.name ? this.props.command.name : ""
            );
            this.state.pins.setValue(
              this.props.command.pins && this.props.command.pins.length
                ? this.props.command.pins.split(",").map(item => {
                    return {
                      label: item,
                      value: item
                    };
                  })
                : []
            );
            this.state.type.setValue(
              this.props.command.type ? this.props.command.type : ""
            );
          }
        }}
      >
        <form
          className="command-form"
          onSubmit={e => {
            e.preventDefault();
            this.saveClicked();
            this.props.hideModal();
          }}
        >
          <FieldGroup
            id="name"
            type="text"
            label="Command name"
            placeholder="Enter command name"
            value={this.state.name.value}
            onChange={this.state.name.onChange}
            validationState={this.state.name.validation}
            validationMessage="Command name must not be empty"
            bsClass="item-form-control form-control"
          />

          <FormGroup
            controlId="command-type-select"
            validationState={this.getValidationState(
              this.state.type.validation
            )}
          >
            <ControlLabel>Command type</ControlLabel>
            <Select
              className="react-select"
              placeholder="Select command type"
              value={this.state.type.value}
              clearable={false}
              searchable={false}
              options={[
                {
                  label: "INPUT",
                  value: "INPUT"
                },
                {
                  label: "OUTPUT",
                  value: "OUTPUT"
                }
              ]}
              onChange={event =>
                event ? this.state.type.setValue(event.value) : ""
              }
            />
            {this.state.type.validation && !this.state.type.validation.valid ? (
              <HelpBlock>
                <FontAwesome name="exclamation-circle" />&nbsp; Select command
                type
              </HelpBlock>
            ) : (
              <HelpBlock>&nbsp;</HelpBlock>
            )}
          </FormGroup>

          <FormGroup
            controlId="command-type-select"
            validationState={this.getValidationState(
              this.state.pins.validation
            )}
          >
            <ControlLabel>Command pins</ControlLabel>
            <Select
              className="react-select"
              placeholder="Select command pins"
              value={this.state.pins.value}
              clearable={false}
              searchable={false}
              multi={true}
              options={
                this.props.device && this.props.device.pins
                  ? this.props.device.pins.split(",").map(item => {
                      return {
                        label: item,
                        value: item
                      };
                    })
                  : []
              }
              onChange={event => (event ? this.state.pins.setValue(event) : "")}
            />
            {this.state.pins.validation && !this.state.pins.validation.valid ? (
              <HelpBlock>
                <FontAwesome name="exclamation-circle" />&nbsp; Select command
                pin
              </HelpBlock>
            ) : (
              <HelpBlock>&nbsp;</HelpBlock>
            )}
          </FormGroup>
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

export default CommandForm;
