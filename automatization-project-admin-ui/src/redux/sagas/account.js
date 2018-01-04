import {
  takeEvery,
  all,
  put,
  call,
  select,
  cps,
  take
} from "redux-saga/effects";
import { DckActionTypes, DckSelectors } from "dck-redux";
import { push, replace } from "react-router-redux";
import * as ActionTypes from "../actions/types";
import Auth from "../auth";

const auth = new Auth();
const pathSelector = state => state.router.location.pathname;

function* initAppSaga() {
  console.log("init app");

  const isAuthenticated = yield call(auth.isAuthenticated);
  console.log("isAuthenticated=", isAuthenticated);

  if (!isAuthenticated) {
    const authResult = yield cps(auth.parseHash);

    if (authResult) {
      console.log("result=", authResult);
      yield call(auth.setSession, authResult);
    } else {
      yield call(auth.login);
    }
  }

  const sessionData = yield call(auth.getSessionData);
  console.log("session data=", sessionData);
  yield put({
    type: DckActionTypes.INITIALIZE_USER_SESSION,
    sessionData: sessionData,
    authenticated: true
  });

  const currentPath = yield select(pathSelector);
  if (currentPath === "/callback" || currentPath === "/") {
    yield put(replace("/nodes"));
  }
}

export function* getSessionData() {
  return yield call(auth.getSessionData);
}

export function* signOut() {
  yield put({
    type: DckActionTypes.INITIALIZE_USER_SESSION,
    sessionData: {},
    authenticated: false
  });

  yield call(auth.logout);
  yield put(push("/"));
  yield call(initAppSaga);
}

function* accountSaga() {
  yield all([
    takeEvery(
      action => action.type === DckActionTypes.INITIALIZE_APP,
      initAppSaga
    ),
    takeEvery(DckActionTypes.SIGN_OUT, signOut)
  ]);
}

export default accountSaga;
