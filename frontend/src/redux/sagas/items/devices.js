import { takeEvery, all, put, call } from "redux-saga/effects";
import { DckActionTypes } from "dck-redux";

import * as ItemTypes from "../../items/types";
import * as ProcessTypes from "../../processes/types";
import { getSessionData } from "../account";
import RestApi from "../../../http-utils/rest-api";

export function* loadDevicesSaga() {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.DEVICES_LOAD
  });

  try {
    const sessionData = yield call(getSessionData);
    const response = yield call(RestApi.ListDevices, sessionData.access_token);

    yield put({
      type: DckActionTypes.ITEMS_SET,
      itemType: ItemTypes.Device,
      data: response.data && response.data.length ? response.data : []
    });
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.DEVICES_LOAD,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error get devices=", error);

    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.DEVICES_LOAD,
      result: {
        success: false
      }
    });
  }
}

function* addDeviceSaga(action) {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.DEVICES_ADD
  });

  try {
    const sessionData = yield call(getSessionData);
    yield call(RestApi.AddDevice, sessionData.access_token, action.data);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.DEVICES_ADD,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error when try to add device=", error);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.DEVICES_ADD,
      result: {
        success: false
      }
    });
  }
}

function* saveDeviceSaga(action) {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.DEVICES_SAVE
  });

  try {
    const sessionData = yield call(getSessionData);
    yield call(
      RestApi.SaveDevice,
      sessionData.access_token,
      action.id,
      action.data
    );
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.DEVICES_SAVE,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error when try to update device=", error);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.DEVICES_SAVE,
      result: {
        success: false
      }
    });
  }
}

function* removeDeviceSaga(action) {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.DEVICES_REMOVE
  });

  try {
    const sessionData = yield call(getSessionData);
    yield call(RestApi.RemoveDevice, sessionData.access_token, action.id);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.DEVICES_REMOVE,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error when try to remove device=", error);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.DEVICES_REMOVE,
      result: {
        success: false
      }
    });
  }
}

function* devicesSaga() {
  yield all([
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEMS_LOAD &&
        action.itemType === ItemTypes.Device,
      loadDevicesSaga
    ),
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEM_ADD &&
        action.itemType === ItemTypes.Device,
      addDeviceSaga
    ),
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEM_SAVE &&
        action.itemType === ItemTypes.Device,
      saveDeviceSaga
    ),
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEM_REMOVE &&
        action.itemType === ItemTypes.Device,
      removeDeviceSaga
    )
  ]);
}

export default devicesSaga;
