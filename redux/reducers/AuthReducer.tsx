import { Action } from "redux";
import { GenderOption } from "../../components/pages/profile/edit-profile";
import { ApplicationState } from "../store";
import { SET_USER_LOGIN_INFO, UPDATE_JWT_TOKEN } from "../types/Auth.types";

export interface UserLoginInfo {
  name: string;
  id: string;
  username: string;
  profileImg: string;
  email: string;
  bio: string;
  followers: number;
  posts: any;
  gender?: GenderOption;
}

export interface AuthReducerState {
  token: string | null;
  user: UserLoginInfo | null;
}
const initialState: AuthReducerState = {
  token: null,
  user: null,
};
export const AuthReducer = (
  state = initialState,
  action: { type: string; data: any }
) => {
  switch (action.type) {
    case UPDATE_JWT_TOKEN:
      localStorage.setItem("jwtToken", action.data);
      return { ...state, token: action.data };
    case SET_USER_LOGIN_INFO:
      return { ...state, user: action.data };
    default:
      return state;
  }
};

export const authTokenSelector = (state: ApplicationState) => {
  return state.auth.token;
};
export const userLoginInfo = (state: ApplicationState) => {
  return state.auth.user;
};
