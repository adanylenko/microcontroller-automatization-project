import { takeEvery, all, put, call, select, cps } from "redux-saga/effects";
import { DckActionTypes, DckSelectors } from "dck-redux";
import { push } from "react-router-redux";
import * as ActionTypes from "../actions/types";
import Auth from "../auth";

const auth = new Auth();

function* initAppSaga() {
  // const sessionData = yield call(getSessionData);
  // if (sessionData == null) {
  //   yield call(signIn);
  // }
  // console.log("session data=", sessionData);
  console.log("init app");

  const authResult = yield cps(auth.parseHash);
  if (authResult) {
    console.log("result=", authResult);
    yield call(auth.setSession, authResult);

    const expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );

    yield put({
      type: DckActionTypes.INITIALIZE_USER_SESSION,
      sessionData: {
        access_token: authResult.accessToken,
        id_token: authResult.idToken,
        expires_at: expiresAt
      },
      authenticated: true
    });
  } else {
    console.log("err");
    alert(`Error:  Check the console for further details.`);
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
  const result = yield call(auth.isAuthenticated);
  if (!result) {
    yield call(auth.login);
  }
  //   if (authResult && authResult.accessToken && authResult.idToken) {
  //     console.log("auth result=", authResult);
  //     this.setSession(authResult);
  //     // yield put(push("/"));
  //   } else if (err) {
  //     console.log(err);
  //     alert(`Error: ${err.error}. Check the console for further details.`);
  //   }
  // });
}

function* processCallback() {
  // const authResult = yield cps(authObject.parseHash);
  // console.log("result=", authResult);
  // yield call(setSession, authResult);
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
