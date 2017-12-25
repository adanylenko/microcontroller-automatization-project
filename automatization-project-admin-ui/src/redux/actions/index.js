import * as UsersActions from "./users";
import * as AccountActions from "./account";

const ActionCreators = Object.assign({}, UsersActions, AccountActions);

export default ActionCreators;
