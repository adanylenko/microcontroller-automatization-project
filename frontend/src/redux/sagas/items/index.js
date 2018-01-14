import { fork, all } from "redux-saga/effects";

import nodesSaga from "./nodes";
import devicesSaga from "./devices";

function* rootSaga(config) {
  yield all([fork(nodesSaga), fork(devicesSaga)]);
}

export default rootSaga;
