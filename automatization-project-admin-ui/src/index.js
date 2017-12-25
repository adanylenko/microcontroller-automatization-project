import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Router, Route, IndexRedirect, IndexRoute } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.min.css";
import { IntlProvider } from "react-intl";
import { DckActionCreators } from "dck-redux";
import PropTypes from "prop-types";
import createHistory from "history/createBrowserHistory";

import registerServiceWorker from "./registerServiceWorker";
import App from "./components/App";
import "./index.css";
import store from "./redux/store";
import ActionCreators from "./redux/actions";
import Callback from "./components/Callback";

const history = syncHistoryWithStore(createHistory(), store);

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
          <div>
            <Route
              path="/"
              render={() => {
                store.dispatch(DckActionCreators.initializeUserSession());
                return <App />;
              }}
            />
            <Route
              path="/callback"
              render={() => {
                store.dispatch(ActionCreators.processCallback());
                return <Callback />;
              }}
            />
          </div>
        </Router>
      </IntlProvider>
    </RootComponent>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
