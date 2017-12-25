import React, { Component } from "react";

class NotAuthenticated extends Component {
  render() {
    return (
      <div className="not-authenticated">
        First you need to authenticate to use this app
      </div>
    );
  }
}
export default NotAuthenticated;
