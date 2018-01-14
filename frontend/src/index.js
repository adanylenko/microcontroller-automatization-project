import React from "react";
import ReactDOM from "react-dom";

import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.min.css";

import registerServiceWorker from "./registerServiceWorker";
import "./index.css";
import { store, history } from "./redux/store";

import Root from "./components/Root";
import "react-select/dist/react-select.css";

ReactDOM.render(
  <Root store={store} history={history} />,
  document.getElementById("root")
);

registerServiceWorker();
