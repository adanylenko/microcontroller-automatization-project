import { takeEvery, all, put, call, select } from "redux-saga/effects";
import { DckActionTypes, DckSelectors } from "dck-redux";

import * as ItemTypes from "../../items/types";
import * as ProcessTypes from "../../processes/types";
import { getSessionData } from "../account";
import RestApi from "../../../http-utils/rest-api";

export function* loadCommandsHistorySaga() {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.COMMAND_HISTORY_LOAD
  });

  let result = true;

  try {
    const sessionData = yield call(getSessionData);
    const currentDeviceId = yield select(
      DckSelectors.selectActiveItemId,
      ItemTypes.Device
    );

    const response = yield call(
      RestApi.ListCommandsHistory,
      sessionData.access_token,
      currentDeviceId
    );

    yield put({
      type: DckActionTypes.ITEMS_SET,
      itemType: ItemTypes.CommandHistory,
      data: response.data && response.data.length ? response.data : []
    });
  } catch (error) {
    result = false;
    console.log("Error get commands=", error);
  }

  yield put({
    type: DckActionTypes.ASYNC_PROCESS_STOP,
    processCode: ProcessTypes.COMMAND_HISTORY_LOAD,
    result: {
      success: result
    }
  });
}

function* commandsHistorySaga() {
  yield all([
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEMS_LOAD &&
        action.itemType === ItemTypes.CommandHistory,
      loadCommandsHistorySaga
    )
  ]);
}

export default commandsHistorySaga;
