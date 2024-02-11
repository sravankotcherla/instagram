import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
});
export interface CreatePostPayload {
  img: string;
  tags: string[] | [];
  content: string;
}

export interface UpdatePostLikes {
  postId: string;
  liked: boolean;
}

export const PostServices = {
  fetchPosts(skip: number = 0) {
    return axiosInstance.get("/api/posts", { params: { skip: skip } });
  },
  createPost(payload: CreatePostPayload) {
    return axiosInstance.put("/api/posts", payload);
  },
  updatePostLikes(payload: UpdatePostLikes) {
    return axiosInstance.post("/api/posts/likes", payload);
  },
};
