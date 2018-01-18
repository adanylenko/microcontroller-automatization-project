import React, { Component } from "react";
import { connect } from "react-redux";
import { DckSelectors, DckActionCreators } from "dck-redux";
import PropTypes from "prop-types";
import { ProgressOverlay, Sidebar } from "dck-react-components";
import { Row, Col } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";

import SidebarItem from "../SidebarItem";
import "./styles.css";
import Devices from "../Devices";
import Nodes from "../Nodes";
import DeviceDetailPage from "../Devices/DetailsPage";

class App extends Component {
  static propTypes = {
    sessionData: PropTypes.object,
    signOut: PropTypes.func.isRequired
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
      <Row className="app-container">
        <Col className="sidebar">
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
                this.props.signOut();
                console.log("logout");
              }}
            >
              Logout
            </a>
          </div>
        </Col>

        <Col className="main-content">
          <Switch>
            <Route path="/nodes" component={Nodes} />
            <Route path="/devices" component={Devices} />
            <Route path="/device/:id" component={DeviceDetailPage} />
          </Switch>
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
  return { signOut: () => dispatch(DckActionCreators.signOut()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
