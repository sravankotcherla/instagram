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
  createPost(payload: { content: string; media: FileList }) {
    const { content, media } = payload;
    const postData = new FormData();
    Object.keys(media).forEach((index) => {
      const fileItem = media[parseInt(index)];
      postData.append("postImg", fileItem);
    });
    postData.append("content", content);
    return axiosInstance.post("/api/posts", postData);
  },
  updatePostLikes(payload: UpdatePostLikes) {
    return axiosInstance.post("/api/posts/likes", payload);
  },
};
