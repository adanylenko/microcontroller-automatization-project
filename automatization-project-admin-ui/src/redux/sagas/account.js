import { takeEvery, all, put, call, select } from "redux-saga/effects";
import { DckActionTypes } from "dck-redux";

function* initAppSaga() {
  console.log("init app saga");
}

function* accountSaga() {
  yield all([
    takeEvery(
      action => action.type === DckActionTypes.INITIALIZE_APP,
      initAppSaga
    )
  ]);
}

export default accountSaga;
