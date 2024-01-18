import { axiosInstance } from "./PostServices";

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

export const ProfileService = { UpdateProfile };
