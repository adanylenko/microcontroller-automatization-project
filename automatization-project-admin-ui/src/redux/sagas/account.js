import { takeEvery, all, put, call, select, cps } from "redux-saga/effects";
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
  if (currentPath === "/callback") {
    yield put(replace("/"));
  }
}

function* checkAuthenticatedSaga() {
  const sessionData = yield call(getSessionData);

  if (sessionData == null) {
    // yield put(push("/sign-in"));
  }
}

function* signIn(props) {
  // if (/access_token|id_token|error/.test(path)) {
  //   console.log("handle");
  //   auth.handleAuthentication();
  // }
  // yield call(login);

  console.log(props);
}

function* initUserSession() {
  // const result = yield call(auth.isAuthenticated);
  // if (!result) {
  //   yield call(auth.login);
  // }
}

function* processCallback() {
  yield put(push("/"));
}

export function* getSessionData() {
  return yield select(DckSelectors.selectSessionData);
}

function* accountSaga() {
  yield all([
    takeEvery(
      action => action.type === DckActionTypes.INITIALIZE_APP,
      initAppSaga
    ),
    takeEvery(DckActionTypes.CHECK_AUTHENTICATED, checkAuthenticatedSaga),
    takeEvery(DckActionTypes.INITIALIZE_USER_SESSION, initUserSession),
    takeEvery(ActionTypes.PROCESS_CALLBACK, processCallback)
  ]);
}

export default accountSaga;
