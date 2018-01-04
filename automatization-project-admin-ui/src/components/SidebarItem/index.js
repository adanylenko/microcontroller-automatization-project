import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import * as FontAwesome from "react-fontawesome";
import PropTypes from "prop-types";

export class SidebarItem extends Component {
  static propTypes = {
    to: PropTypes.any,
    external: PropTypes.any,
    itemClass: PropTypes.any,
    activeClass: PropTypes.any,
    icon: PropTypes.any,
    iconContainerClass: PropTypes.any,
    iconSize: PropTypes.any,
    children: PropTypes.any,
    textClass: PropTypes.any
  };

  renderInternalLink() {
    return (
      <NavLink to={this.props.to} activeClassName="active">
        <div
          className={
            this.props.iconContainerClass
              ? this.props.iconContainerClass
              : "sidebar-item-icon-container"
          }
        >
          <FontAwesome
            name={this.props.icon}
            size={this.props.iconSize ? this.props.iconSize : "lg"}
          />
        </div>
        <span
          className={
            this.props.textClass ? this.props.textClass : "sidebar-item-text"
          }
        >
          {this.props.children}
        </span>
      </NavLink>
    );
  }

  renderExternalLink() {
    return (
      <a href={this.props.to}>
        <div
          className={
            this.props.iconContainerClass
              ? this.props.iconContainerClass
              : "sidebar-item-icon-container"
          }
        >
          <FontAwesome
            name={this.props.icon}
            size={this.props.iconSize ? this.props.iconSize : "lg"}
          />
        </div>
        <span
          className={
            this.props.textClass ? this.props.textClass : "sidebar-item-text"
          }
        >
          {this.props.children}
        </span>
      </a>
    );
  }

  render() {
    return (
      <li
        className={this.props.itemClass ? this.props.itemClass : "sidebar-item"}
      >
        {this.props.external
          ? this.renderExternalLink()
          : this.renderInternalLink()}
      </li>
    );
  }
}

export default SidebarItem;
