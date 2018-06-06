const BASE_PATH = "http://localhost:8080/api/";

export const NODES_URL = id =>
  !id ? BASE_PATH + "nodes/" : BASE_PATH + "nodes/" + id;

export const DEVICES_URL = id =>
  !id ? BASE_PATH + "devices/" : BASE_PATH + "devices/" + id;

export const COMMANDS_URL = {
  listByDeviceId: deviceId => BASE_PATH + "commands/list/" + deviceId,
  base: id => (!id ? BASE_PATH + "commands/" : BASE_PATH + "commands/" + id)
};

export const STATES_URL = {
  listByCommandId: commandId => BASE_PATH + "states/list/" + commandId,
  base: id => (!id ? BASE_PATH + "states/" : BASE_PATH + "states/" + id)
};

export const COMMANDS_HISTORY_URL = {
  listByDeviceId: deviceId => BASE_PATH + "command-history/list/" + deviceId
};
