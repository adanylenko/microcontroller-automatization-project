import * as types from "./types";

export function resetUserPassword(itemType, id) {
  return {
    type: types.RESET_USER_PASSWORD,
    itemType,
    id
  };
}
