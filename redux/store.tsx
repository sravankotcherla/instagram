import { combineReducers, legacy_createStore } from "redux";
import { AuthReducer, AuthReducerState } from "./reducers/AuthReducer";

export interface ApplicationState {
  auth: AuthReducerState;
}
const rootReducer = combineReducers({ auth: AuthReducer });
export const store = legacy_createStore(rootReducer);
