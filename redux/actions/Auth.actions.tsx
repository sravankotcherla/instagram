import { GenderOption } from "../../components/pages/profile/edit-profile";
import { SET_USER_LOGIN_INFO } from "../types/Auth.types";

export const setUserLoginInfo = (userInfo: {
  bio?: string | undefined;
  profileImg?: string | undefined;
  gender?: GenderOption | undefined;
  name?: string | undefined;
  id?: string | undefined;
  username?: string | undefined;
  email?: string | undefined;
  followers?: number | undefined;
  posts?: any;
}) => {
  return { type: SET_USER_LOGIN_INFO, data: userInfo };
};
