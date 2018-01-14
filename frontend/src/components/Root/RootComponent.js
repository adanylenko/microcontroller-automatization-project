import React, { Component } from "react";
import PropTypes from "prop-types";
import { DckActionCreators } from "dck-redux";
import { connect } from "react-redux";

class RootComponent extends Component {
  static propTypes = {
    children: PropTypes.element
  };

  render() {
    return <div className="init-container">{this.props.children}</div>;
  }

  componentWillMount() {
    this.props.initApp();
  }
}

const mapStateToProps = state => {
  const mapping = {};

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    initApp: () => dispatch(DckActionCreators.initializeApp())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootComponent);
