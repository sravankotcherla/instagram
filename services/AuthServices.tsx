import axios from "axios";
import { UserSingleSignInProfile } from "../components/pages/signIn";
import { axiosInstance } from "./PostServices";

export const AuthServices = {
  signUp(user: any) {
    return axios.post("/auth/sign-up", { user: user });
  },
  signIn({
    email,
    password,
  }: {
    email: string | null;
    password: string | null;
  }) {
    return axiosInstance.get("/auth/sign-in", {
      params: { email, password },
    });
  },
  singleSignIn(userProfile: UserSingleSignInProfile) {
    return axios.get("/auth/single-sign-in", { params: userProfile });
  },
  logout() {
    return axios.get("/auth/logout");
  },
};
