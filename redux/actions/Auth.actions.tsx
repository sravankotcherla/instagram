import { UserLoginInfo } from "../reducers/AuthReducer";
import { SET_USER_LOGIN_INFO } from "../types/Auth.types";

export const setUserLoginInfo = (userInfo: UserLoginInfo) => {
  return { type: SET_USER_LOGIN_INFO, data: userInfo };
};
