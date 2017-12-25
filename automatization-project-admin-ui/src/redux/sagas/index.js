import { fork, all } from "redux-saga/effects";
import accountSaga from "./account";

function* rootSaga() {
  yield all([fork(accountSaga)]);
}

export default rootSaga;
