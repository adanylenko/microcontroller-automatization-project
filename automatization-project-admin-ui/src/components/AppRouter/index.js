import React, { Component } from "react";
import { connect } from "react-redux";
import { Provider } from "react-redux";
import { Router, Route } from "react-router-dom";
import { ConnectedRouter } from "react-router-redux";
import { IntlProvider } from "react-intl";

import PropTypes from "prop-types";
import { DckSelectors, DckActionCreators } from "dck-redux";
import { ProgressOverlay } from "dck-react-components";

import { store, history } from "../../redux/store";
import ActionCreators from "../../redux/actions";
import Callback from "../Callback";
import App from "../App";

class AppRouter extends Component {
  static propTypes = {};

  render() {
    return (
      <div className="init-container">
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <IntlProvider locale="en">
              {/* <RootComponent> */}
              <Router history={history}>
                <div>
                  <Route path="/" component={App} />
                  <Route path="/callback" component={Callback} />
                </div>
              </Router>
              {/* </RootComponent> */}
            </IntlProvider>
          </ConnectedRouter>
        </Provider>
      </div>
    );
  }

  testMethod() {
    <div>Test</div>;
  }

  // componentWillMount() {
  //   store.dispatch(DckActionCreators.initializeApp());
  // }
}

const mapStateToProps = state => {
  const mapping = {
    // locations: StoreSelectors.selectLocations(state),
    // rooms: groupBy(StoreSelectors.selectFilteredRooms(state), "floorName"),
    // currentLocation: StoreSelectors.selectCurrentLocation(state),
    // searchTerm: DckSelectors.selectItemSearchTerm(state, ItemTypes.Room),
    // roomsLoading: DckSelectors.selectProcessRunning(
    //   state,
    //   ProcessTypes.ROOMS_LOAD
    // ),
    // roomsLoadingFailed: DckSelectors.selectProcessFailed(
    //   state,
    //   ProcessTypes.ROOMS_LOAD
    // )
  };

  return mapping;
};

const mapDispatchToProps = dispatch => {
  return {
    // setSearchTerm: term =>
    //   dispatch(DckActionCreators.setItemSearchTerm(ItemTypes.Room, term)),
    // loadRooms: () => dispatch(DckActionCreators.itemsLoad(ItemTypes.Room))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppRouter);
