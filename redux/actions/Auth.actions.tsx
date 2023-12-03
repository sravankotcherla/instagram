import { UserLoginInfo } from "../reducers/AuthReducer";
import { SET_USER_LOGIN_INFO, UPDATE_JWT_TOKEN } from "../types/Auth.types";

export const UpdateAuthToken = (token: string) => {
  return { type: UPDATE_JWT_TOKEN, data: token };
};

export const setUserLoginInfo = (userInfo: UserLoginInfo) => {
  return { type: SET_USER_LOGIN_INFO, data: userInfo };
};
