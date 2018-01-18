import { takeEvery, all, put, call, select } from "redux-saga/effects";
import { DckActionTypes, DckSelectors } from "dck-redux";

import * as ItemTypes from "../../items/types";
import * as ProcessTypes from "../../processes/types";
import { getSessionData } from "../account";
import RestApi from "../../../http-utils/rest-api";

export function* loadCommandsSaga() {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.COMMANDS_LOAD
  });

  try {
    const sessionData = yield call(getSessionData);
    const currentDeviceId = yield select(
      DckSelectors.selectActiveItemId,
      ItemTypes.Device
    );

    const response = yield call(
      RestApi.ListCommands,
      sessionData.access_token,
      currentDeviceId
    );

    yield put({
      type: DckActionTypes.ITEMS_SET,
      itemType: ItemTypes.Command,
      data: response.data && response.data.length ? response.data : []
    });
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.COMMANDS_LOAD,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error get commands=", error);

    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.COMMANDS_LOAD,
      result: {
        success: false
      }
    });
  }
}

function* addCommandSaga(action) {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.COMMANDS_ADD
  });

  try {
    const sessionData = yield call(getSessionData);
    yield call(RestApi.AddCommand, sessionData.access_token, action.data);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.COMMANDS_ADD,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error when try to add command=", error);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.COMMANDS_ADD,
      result: {
        success: false
      }
    });
  }
}

function* saveCommandSaga(action) {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.COMMANDS_SAVE
  });

  try {
    const sessionData = yield call(getSessionData);
    yield call(
      RestApi.SaveCommand,
      sessionData.access_token,
      action.id,
      action.data
    );
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.COMMANDS_SAVE,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error when try to update command=", error);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.COMMANDS_SAVE,
      result: {
        success: false
      }
    });
  }
}

function* removeCommandSaga(action) {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.COMMANDS_REMOVE
  });

  try {
    const sessionData = yield call(getSessionData);
    yield call(RestApi.RemoveCommand, sessionData.access_token, action.id);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.COMMANDS_REMOVE,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error when try to remove command=", error);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.COMMANDS_REMOVE,
      result: {
        success: false
      }
    });
  }
}

function* commandsSaga() {
  yield all([
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEMS_LOAD &&
        action.itemType === ItemTypes.Command,
      loadCommandsSaga
    ),
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEM_ADD &&
        action.itemType === ItemTypes.Command,
      addCommandSaga
    ),
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEM_SAVE &&
        action.itemType === ItemTypes.Command,
      saveCommandSaga
    ),
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEM_REMOVE &&
        action.itemType === ItemTypes.Command,
      removeCommandSaga
    )
  ]);
}

export default commandsSaga;
