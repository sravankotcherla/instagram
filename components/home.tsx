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

  const [skipNumber, setSkipNumber] = useState<number>(0);
  const [isScrollLoading, setIsScrollLoading] = useState<boolean>(false);
  const [atEnd, setAtEnd] = useState<boolean>(false);

  const fetchPosts = () => {
    PostServices.fetchPosts(skipNumber)
      .then((resp) => {
        debugger;
        setPostsList((prev) => [...prev, ...resp.data]);
        setSkipNumber((prev) => prev + resp.data?.length || 0);
        setIsScrollLoading(false);
        if (resp.data?.length < 5) {
          setAtEnd(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostsScroll = (e: any) => {
    const { scrollTop, scrollHeight } = e.target;
    console.log(scrollHeight - scrollTop - window.innerHeight);
    if (
      scrollHeight - scrollTop - window.innerHeight <= 300 &&
      !isScrollLoading &&
      !atEnd
    ) {
      setIsScrollLoading(true);
      fetchPosts();
    }
  };

  const renderPosts = useMemo(() => {
    debugger;
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
    <div
      className="text-white flex flex-col w-full h-full items-center pt-5 overflow-scroll"
      onScroll={handlePostsScroll}
    >
      {renderPosts}
      {isScrollLoading && !atEnd && (
        <div className="w-[470px] h-[300px] my-8">
          <Loader size={75} />
        </div>
      )}
      {atEnd && (
        <div className="text-white text-center my-8">No more posts to show</div>
      )}
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
