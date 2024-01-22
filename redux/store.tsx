import { combineReducers, compose, legacy_createStore } from "redux";
import { AuthReducer, AuthReducerState } from "./reducers/AuthReducer";
import { composeWithDevTools } from "@redux-devtools/extension";
import {
  CreatePostModalInfo,
  CreatePostReducer,
} from "./reducers/CreatePostReducer";
export interface ApplicationState {
  auth: AuthReducerState;
  post: CreatePostModalInfo;
}
const rootReducer = combineReducers({
  auth: AuthReducer,
  post: CreatePostReducer,
});
const enhancers = composeWithDevTools();

export const store = legacy_createStore(rootReducer, enhancers);
