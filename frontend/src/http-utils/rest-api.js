import * as RestUrls from "./config";

export function ApiCall(url, idToken, body, method = "POST") {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json"
  };

  if (idToken) {
    headers["Authorization"] = `Bearer ${idToken}`;
  }

  const params = {
    method: method,
    headers: headers
  };

  if (body) {
    params.body = JSON.stringify(body);
  }

  return fetch(url, params).then(response => {
    if (response.status >= 400 && response.status < 600) {
      throw new Error("Request failed");
    }
    return response.json();
  });
}

export const RestApi = {
  ListNodes: idToken => {
    return ApiCall(RestUrls.NODES_URL(), idToken, null, "GET");
  },
  AddNode: (idToken, node) => {
    return ApiCall(RestUrls.NODES_URL(), idToken, node, "PUT");
  },
  SaveNode: (idToken, id, node) => {
    return ApiCall(RestUrls.NODES_URL(id), idToken, node, "POST");
  },
  RemoveNode: (idToken, id) => {
    return ApiCall(RestUrls.NODES_URL(id), idToken, null, "DELETE");
  },

  ListDevices: idToken => {
    return ApiCall(RestUrls.DEVICES_URL(), idToken, null, "GET");
  },
  AddDevice: (idToken, node) => {
    return ApiCall(RestUrls.DEVICES_URL(), idToken, node, "PUT");
  },
  SaveDevice: (idToken, id, node) => {
    return ApiCall(RestUrls.DEVICES_URL(id), idToken, node, "POST");
  },
  RemoveDevice: (idToken, id) => {
    return ApiCall(RestUrls.DEVICES_URL(id), idToken, null, "DELETE");
  },

  ListCommands: (idToken, deviceId) => {
    return ApiCall(
      RestUrls.COMMANDS_URL.listByDeviceId(deviceId),
      idToken,
      null,
      "GET"
    );
  },
  AddCommand: (idToken, command) => {
    return ApiCall(RestUrls.COMMANDS_URL.base(), idToken, command, "PUT");
  },
  SaveCommand: (idToken, id, command) => {
    return ApiCall(RestUrls.COMMANDS_URL.base(id), idToken, command, "POST");
  },
  RemoveCommand: (idToken, id) => {
    return ApiCall(RestUrls.COMMANDS_URL.base(id), idToken, null, "DELETE");
  },

  ListStates: (idToken, commandId) => {
    return ApiCall(
      RestUrls.STATES_URL.listByCommandId(commandId),
      idToken,
      null,
      "GET"
    );
  },
  AddState: (idToken, state) => {
    return ApiCall(RestUrls.STATES_URL.base(), idToken, state, "PUT");
  },
  SaveState: (idToken, id, state) => {
    return ApiCall(RestUrls.STATES_URL.base(id), idToken, state, "POST");
  },
  RemoveState: (idToken, id) => {
    return ApiCall(RestUrls.STATES_URL.base(id), idToken, null, "DELETE");
  },
  ListCommandsHistory: (idToken, deviceId) => {
    return ApiCall(
      RestUrls.COMMANDS_HISTORY_URL.listByDeviceId(deviceId),
      idToken,
      null,
      "GET"
    );
  }
};

export default RestApi;
