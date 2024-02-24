import { UserLoginInfo } from "../redux/reducers/AuthReducer";
import { axiosInstance } from "./PostServices";

export interface createCommentPayload {
  parent?: string;
  postId: string;
  text: string;
}
export interface Comment {
  _id: string;
  text: string;
  postId: string;
  parent: string | null;
  likes: number;
  createdBy: UserLoginInfo;
  createdAt: string;
}
export const CommentServices = {
  postComment(commentInfo: createCommentPayload) {
    return axiosInstance.post("/api/comment", commentInfo);
  },
  fetchComments(postId: string) {
    return axiosInstance.get(`/api/comment/${postId}`);
  },
};
