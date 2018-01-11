import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { routerReducer, routerMiddleware } from "react-router-redux";
import createHistory from "history/createBrowserHistory";

import { createDckReducer } from "dck-redux";
import rootSaga from "./sagas";
import * as ItemTypes from "./items/types";
import * as ProcessTypes from "./processes/types";

export const history = createHistory();

const sagaMiddleware = createSagaMiddleware();
const routerMiddl = routerMiddleware(history);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore(initialState) {
  return createStore(
    combineReducers({
      dck: createDckReducer(ItemTypes, ProcessTypes),
      router: routerReducer
    }),
    initialState,
    composeEnhancers(
      applyMiddleware(sagaMiddleware),
      applyMiddleware(routerMiddl)
    )
  );
}

export const store = configureStore({});
sagaMiddleware.run(rootSaga);

export default store;
