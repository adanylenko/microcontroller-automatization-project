import { takeEvery, all, put, call, apply } from "redux-saga/effects";
import { DckActionTypes } from "dck-redux";

import * as ItemTypes from "../../items/types";
import * as ProcessTypes from "../../processes/types";
import { getSessionData } from "../account";
import RestApi from "../../../http-utils/rest-api";

export function* loadNodesSaga() {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.NODES_LOAD
  });

  try {
    const sessionData = yield call(getSessionData);
    console.log("session data=", sessionData);
    const response = yield call(RestApi.ListNodes, sessionData.access_token);

    yield put({
      type: DckActionTypes.ITEMS_SET,
      itemType: ItemTypes.Node,
      data: response.data && response.data.length ? response.data : []
    });
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.NODES_LOAD,
      result: {
        success: true
      }
    });
  } catch (error) {
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.NODES_LOAD,
      result: {
        success: false
      }
    });
  }
}

function* nodesSaga() {
  yield all([
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEMS_LOAD &&
        action.itemType === ItemTypes.Node,
      loadNodesSaga
    )
  ]);
}

export default nodesSaga;
