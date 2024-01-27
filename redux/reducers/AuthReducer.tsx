import { GenderOption } from "../../components/pages/profile/edit-profile";
import { ApplicationState } from "../store";
import { SET_USER_LOGIN_INFO } from "../types/Auth.types";

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
  user: UserLoginInfo | null;
}
const initialState: AuthReducerState = {
  user: null,
};
export const AuthReducer = (
  state = initialState,
  action: { type: string; data: any }
) => {
  switch (action.type) {
    case SET_USER_LOGIN_INFO:
      return { ...state, user: action.data };
    default:
      return state;
  }
};

export const userLoginInfo = (state: ApplicationState) => {
  return state.auth.user;
};
