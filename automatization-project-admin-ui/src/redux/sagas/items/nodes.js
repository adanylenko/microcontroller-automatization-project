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
    console.log("Error get nodes=", error);

    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.NODES_LOAD,
      result: {
        success: false
      }
    });
  }
}

function* addNodeSaga(action) {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.NODES_ADD
  });

  try {
    const sessionData = yield call(getSessionData);
    yield call(RestApi.AddNode, sessionData.access_token, action.data);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.NODES_ADD,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error when try to add node=", error);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.NODES_ADD,
      result: {
        success: false
      }
    });
  }
}

function* saveNodeSaga(action) {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.NODES_SAVE
  });

  try {
    const sessionData = yield call(getSessionData);
    yield call(
      RestApi.SaveNode,
      sessionData.access_token,
      action.id,
      action.data
    );
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.NODES_SAVE,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error when try to update node=", error);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.NODES_SAVE,
      result: {
        success: false
      }
    });
  }
}

function* removeNodeSaga(action) {
  yield put({
    type: DckActionTypes.ASYNC_PROCESS_START,
    processCode: ProcessTypes.NODES_REMOVE
  });

  try {
    const sessionData = yield call(getSessionData);
    yield call(RestApi.RemoveNode, sessionData.access_token, action.id);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.NODES_REMOVE,
      result: {
        success: true
      }
    });
  } catch (error) {
    console.log("Error when try to remove node=", error);
    yield put({
      type: DckActionTypes.ASYNC_PROCESS_STOP,
      processCode: ProcessTypes.NODES_REMOVE,
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
    ),
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEM_ADD &&
        action.itemType === ItemTypes.Node,
      addNodeSaga
    ),
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEM_SAVE &&
        action.itemType === ItemTypes.Node,
      saveNodeSaga
    ),
    takeEvery(
      action =>
        action.type === DckActionTypes.ITEM_REMOVE &&
        action.itemType === ItemTypes.Node,
      removeNodeSaga
    )
  ]);
}

export default nodesSaga;
