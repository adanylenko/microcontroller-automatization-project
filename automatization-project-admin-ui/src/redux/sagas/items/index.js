import { fork, all } from "redux-saga/effects";

import nodesSaga from "./nodes";

function* rootSaga(config) {
  yield all([fork(nodesSaga)]);
}

export default rootSaga;
