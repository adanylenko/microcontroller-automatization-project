import { takeEvery, all, put, call, select } from "redux-saga/effects";
import { DckActionTypes, DckSelectors } from "dck-redux";

import * as ItemTypes from "../../items/types";
import * as ProcessTypes from "../../processes/types";
import { getSessionData } from "../account";
import RestApi from "../../../http-utils/rest-api";

export function* loadStatesSaga() {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.STATES_LOAD
  });

  try {
    const sessionData = yield call(getSessionData);
    const currentCommandId = yield select(
      DckSelectors.selectActiveItemId,
      ItemTypes.Command
    );

    const response = yield call(
      RestApi.ListStates,
      sessionData.access_token,
      currentCommandId
    );

    yield put({
      type: DckActionTypes.ITEMS_SET,
      itemType: ItemTypes.State,
      data: response.data && response.data.length ? response.data : []
    });
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.STATES_LOAD,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error get states=", error);

    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.STATES_LOAD,
      result: {
        success: false
      }
    });
  }
}

function* addStateSaga(action) {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.STATES_ADD
  });

  try {
    const sessionData = yield call(getSessionData);
    yield call(RestApi.AddState, sessionData.access_token, action.data);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.STATES_ADD,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error when try to add state=", error);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.STATES_ADD,
      result: {
        success: false
      }
    });
  }
}

function* saveStateSaga(action) {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.STATES_SAVE
  });

  try {
    const sessionData = yield call(getSessionData);
    yield call(
      RestApi.SaveState,
      sessionData.access_token,
      action.id,
      action.data
    );
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.STATES_SAVE,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error when try to update state=", error);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.STATES_SAVE,
      result: {
        success: false
      }
    });
  }
}

function* removeStateSaga(action) {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.STATES_REMOVE
  });

  try {
    const sessionData = yield call(getSessionData);
    yield call(RestApi.RemoveState, sessionData.access_token, action.id);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.STATES_REMOVE,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error when try to remove state=", error);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.STATES_REMOVE,
      result: {
        success: false
      }
    });
  }
}

function* statesSaga() {
  yield all([
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEMS_LOAD &&
        action.itemType === ItemTypes.State,
      loadStatesSaga
    ),
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEM_ADD &&
        action.itemType === ItemTypes.State,
      addStateSaga
    ),
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEM_SAVE &&
        action.itemType === ItemTypes.State,
      saveStateSaga
    ),
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEM_REMOVE &&
        action.itemType === ItemTypes.State,
      removeStateSaga
    )
  ]);
}

export default statesSaga;
