import { fork, all } from "redux-saga/effects";

import nodesSaga from "./nodes";
import devicesSaga from "./devices";
import commandsSaga from "./commands";
import statesSaga from "./states";
import commandHistorySaga from "./command-history";

function* rootSaga(config) {
  yield all([
    fork(nodesSaga),
    fork(devicesSaga),
    fork(commandsSaga),
    fork(statesSaga),
    fork(commandHistorySaga)
  ]);
}

export default rootSaga;
