import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import {
  Router,
  Route,
  IndexRedirect,
  IndexRoute,
  browserHistory
} from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.min.css";
import { IntlProvider } from "react-intl";
import { DckActionCreators } from "dck-redux";
import PropTypes from "prop-types";

import registerServiceWorker from "./registerServiceWorker";
import App from "./components/App";
import "./index.css";
import store from "./redux/store";
import { ActionCreators } from "./redux/actions";

const history = syncHistoryWithStore(browserHistory, store);

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
    <RootComponent>
      <IntlProvider locale="en">
        <Router history={history}>
          <Route path="/" component={App} />
        </Router>
      </IntlProvider>
    </RootComponent>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
