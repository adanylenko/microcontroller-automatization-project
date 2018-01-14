import React from "react";
import PropTypes from "prop-types";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import { IntlProvider } from "react-intl";

import App from "../App";
import RootComponent from "./RootComponent";

const Root = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <IntlProvider locale="en">
        <RootComponent>
          <Router>
            <Route path="/" component={App} />
          </Router>
        </RootComponent>
      </IntlProvider>
    </ConnectedRouter>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Root;
