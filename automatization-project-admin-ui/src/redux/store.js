import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { routerReducer, routerMiddleware } from "react-router-redux";
import { browserHistory } from "react-router";

import { createDckReducer } from "dck-redux";
import rootSaga from "./sagas";
import * as ItemTypes from "./items/types";
import * as ProcessTypes from "./processes/types";

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore(initialState) {
  return createStore(
    combineReducers({
      dck: createDckReducer(ItemTypes, ProcessTypes),
      routing: routerReducer
    }),
    initialState,
    composeEnhancers(
      applyMiddleware(sagaMiddleware, routerMiddleware(browserHistory))
    )
  );
}

export function configureStoreWithoutMiddleware(initialState) {
  return createStore(
    combineReducers({
      dck: createDckReducer(ItemTypes, ProcessTypes)
    }),
    initialState
  );
}

const store = configureStore({});
sagaMiddleware.run(rootSaga);

export default store;
