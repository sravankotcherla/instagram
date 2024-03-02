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
  replyInfo: { replies: number };
}
export const CommentServices = {
  postComment(commentInfo: createCommentPayload) {
    return axiosInstance.post("/api/comment", commentInfo);
  },
  fetchComments(postId: string, parent: string | undefined = undefined) {
    return axiosInstance.get(`/api/comment/`, { params: { postId, parent } });
  },
};
