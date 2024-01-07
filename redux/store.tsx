import { combineReducers, compose, legacy_createStore } from "redux";
import { AuthReducer, AuthReducerState } from "./reducers/AuthReducer";
import { composeWithDevTools } from "@redux-devtools/extension";
export interface ApplicationState {
  auth: AuthReducerState;
}
const rootReducer = combineReducers({ auth: AuthReducer });
const enhancers = composeWithDevTools();

export const store = legacy_createStore(rootReducer, enhancers);
