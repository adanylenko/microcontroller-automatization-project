import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.min.css";
import { IntlProvider } from "react-intl";
import { DckActionCreators } from "dck-redux";
import PropTypes from "prop-types";

import registerServiceWorker from "./registerServiceWorker";
import App from "./components/App";
import "./index.css";
import { store, history } from "./redux/store";

import Nodes from "./components/Nodes";

class RootComponent extends Component {
  static propTypes = {
    children: PropTypes.element
  };

  render() {
    return <div className="init-container">{this.props.children}</div>;
  }

  componentWillMount() {
    store.dispatch(DckActionCreators.initializeApp());
  }
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <IntlProvider locale="en">
        <RootComponent>
          <Router history={history}>
            <App>
              <Route path="/nodes" component={Nodes} />
            </App>
          </Router>
        </RootComponent>
      </IntlProvider>
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
