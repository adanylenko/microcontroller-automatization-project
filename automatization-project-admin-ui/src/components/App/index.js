import React, { Component } from "react";
import { connect } from "react-redux";
import { DckSelectors, DckActionCreators } from "dck-redux";
import PropTypes from "prop-types";
import { ProgressOverlay, Sidebar } from "dck-react-components";
import { Grid, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import SidebarItem from "../SidebarItem";

import "./styles.css";

class App extends Component {
  static propTypes = {
    sessionData: PropTypes.object
  };

  render() {
    return this.props.sessionData && this.props.sessionData.access_token
      ? this.renderSidebar()
      : this.renderLoading();
  }

  renderLoading() {
    return <ProgressOverlay visible={true}>Loading app...</ProgressOverlay>;
  }

  renderSidebarHeader() {
    return (
      <div className="sidebar-header">
        <h4 className="sidebar-header-text">
          Automatization<br />Project
        </h4>
      </div>
    );
  }

  renderSidebar() {
    return (
      <Row bsClass="app-container row">
        <Col xs={5} sm={3} md={2} lg={2} className="sidebar">
          <Sidebar headerComponent={this.renderSidebarHeader()}>
            <SidebarItem
              to="/nodes"
              icon="desktop"
              textClass="sidebar-item-text"
            >
              Nodes list
            </SidebarItem>
            <SidebarItem
              to="/devices"
              icon="list-alt"
              textClass="sidebar-item-text"
            >
              Devices List
            </SidebarItem>
          </Sidebar>
          <div className="logout-button">
            <a
              onClick={() => {
                // this.props.signOut();
                console.log("logout");
              }}
            >
              Logout
            </a>
          </div>
        </Col>

        <Col
          xs={7}
          sm={9}
          md={10}
          lg={10}
          xsOffset={5}
          smOffset={3}
          mdOffset={2}
          lgOffset={2}
          bsClass="main-content"
        >
          {this.props.children}
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => {
  const mapping = {
    sessionData: DckSelectors.selectSessionData(state)
  };

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
