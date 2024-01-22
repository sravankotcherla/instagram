import axios from "axios";

export const getJwtToken = () => {
  if (typeof window !== "undefined") {
    console.log(localStorage.getItem("jwtToken"));
    return localStorage.getItem("jwtToken");
  }
  return "";
};
export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  headers: {
    Authorization: `Bearer ${getJwtToken()}`,
  },
});
export interface CreatePostPayload {
  img: string;
  tags: string[] | [];
  content: string;
}
export const PostServices = {
  fetchPosts() {
    return axiosInstance.get("/api");
  },
  createPost(payload: CreatePostPayload) {
    return axiosInstance.put("/api/post", payload);
  },
};
