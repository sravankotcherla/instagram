import { AxiosResponse } from "axios";
import { axiosInstance } from "./PostServices";

export interface UserProfile {
  _id: string;
  name: string;
  username: string;
  email: string;
  profileImg: string;
  posts: string;
  following: number;
  followers: number;
  isFollowed?: boolean;
}
export interface ProfileServicePayload {
  bio?: string;
  profileImg?: string;
  gender?:
    | {
        value: string;
        type: string;
      }
    | undefined;
}
const UpdateProfile = async (payload: ProfileServicePayload) => {
  return axiosInstance.post("/api/profile", payload);
};

const searchProfile = async (searchText: string) => {
  return axiosInstance.get("/api/search/profile", { params: { searchText } });
};

const getProfile = async (username: string) => {
  return axiosInstance.get("/api/profile", { params: { username } });
};

const follow = async (userId: string, following: boolean) => {
  return axiosInstance.put("/api/profile/follow", { userId, following });
};
export const ProfileService = {
  UpdateProfile,
  searchProfile,
  getProfile,
  follow,
};
