import axios from "axios";

export const BASE_URL = process.env.EXPRESS_HOST;
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});
export interface CreatePostPayload {
  img: string;
  tags: string[] | [];
  content: string;
}

export interface UpdatePostLikes {
  srcId: string;
  liked: boolean;
  type: string;
}

export const PostServices = {
  fetchPosts(skip: number = 0) {
    return axiosInstance.get("/api/posts", { params: { skip: skip } });
  },
  createPost(payload: FormData) {
    return axiosInstance.post("/api/posts", payload);
  },
  updatePostLikes(payload: UpdatePostLikes) {
    return axiosInstance.post("/api/posts/likes", payload);
  },
};
