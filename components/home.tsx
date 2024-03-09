import { useEffect, useMemo, useState } from "react";
import { UserLoginInfo } from "../redux/reducers/AuthReducer";
import { Comment } from "../services/CommentServices";
import { PostServices } from "../services/PostServices";
import { PostCommentsModal } from "./modals/post-comments-model";
import { PostCard } from "./posts/post-card";
import { Loader } from "./shared/loaders/clipLoader";

export interface PostDetails {
  _id: string;
  createdBy: string;
  createdAt: string;
  content: string;
  img: string;
  tags: string[];
  likes: number;
  userInfo: UserLoginInfo[];
  isLiked: [LikesMap];
}

export interface LikesMap {
  _id: string;
  userId: string;
  postId: string;
  archived: boolean;
}
export interface HomeProps {
  posts?: any;
}
export const HomePosts = (props: HomeProps) => {
  const { posts } = props;

  const [postsList, setPostsList] = useState<PostDetails[]>(posts || []);

  const [commentDetails, setCommentDetails] = useState<Array<Comment> | null>(
    null
  );
  const [postCommentDetails, setpostCommentDetails] =
    useState<PostDetails | null>(null);

  useEffect(() => {
    PostServices.fetchPosts()
      .then((resp) => {
        setPostsList(resp.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const renderPosts = useMemo(() => {
    return postsList.map((postItem) => {
      return (
        <PostCard
          key={postItem._id}
          postDetails={postItem}
          setCommentsDetails={setCommentDetails}
          setCommentPostDetails={setpostCommentDetails}
        />
      );
    });
  }, [postsList]);

  if (!postsList?.length) {
    return <Loader />;
  }

  return (
    <div className="text-white flex flex-col w-full h-full items-center pt-5 overflow-scroll">
      {renderPosts}
      {postCommentDetails && commentDetails && (
        <PostCommentsModal
          isOpen={postCommentDetails !== null}
          postDetails={postCommentDetails}
          commentsList={commentDetails}
          setCommentPostDetails={setpostCommentDetails}
          setCommentsDetails={setCommentDetails}
        />
      )}
    </div>
  );
};
