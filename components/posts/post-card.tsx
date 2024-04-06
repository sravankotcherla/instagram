import { IconButton } from "@mui/material";
import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { getCreatedAgo } from "../../helpers/posts";
import { CommentIcon } from "../../icons/comment-icon";
import { Comment, CommentServices } from "../../services/CommentServices";

import { PostServices } from "../../services/PostServices";
import { PostDetails } from "../home";
import { PostActionsBar } from "./post-actions-bar";

interface PostCardProps {
  postDetails: PostDetails;
  setCommentPostDetails: Dispatch<SetStateAction<PostDetails | null>>;
  setCommentsDetails: Dispatch<SetStateAction<Comment[] | null>>;
}

export const PostCard = (props: PostCardProps) => {
  const { postDetails, setCommentPostDetails, setCommentsDetails } = props;

  const [liked, setLiked] = useState<boolean>(postDetails?.isLiked?.length > 0);
  const [likesCount, setLikesCount] = useState<number>(postDetails?.likes || 0);

  const fetchComments = () => {
    CommentServices.fetchComments(postDetails._id)
      .then((resp) => {
        const commentsList = resp.data;
        console.log(commentsList);
        setCommentsDetails(commentsList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOnLike = () => {
    setLiked((prev) => !prev);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
    PostServices.updatePostLikes({
      srcId: postDetails._id,
      liked: !liked,
      type: "post",
    });
  };

  return (
    <div className="postCard text-sm">
      <div
        id="postCardHeader"
        className="flex flex-row items-center postCardHeader mb-3"
      >
        <Image
          width={32}
          height={32}
          alt="Content"
          src={postDetails.userInfo[0].profileImg}
          className="userDp"
        />
        <span className="font-semibold  ml-2">
          {postDetails.userInfo[0].username}
        </span>
        <span className="text-secondary mx-1">.</span>
        <span className="text-secondary">
          {getCreatedAgo(postDetails.createdAt)}
        </span>
      </div>
      <div
        id="postCardMedia"
        className="flex items-center postCardMedia w-[470px] h-[585px]"
      >
        <img
          alt="Media"
          src={`http://localhost:3000/${postDetails._id}.${
            postDetails.img.split(".")[
              postDetails.img.split(".")?.length - 1 || 0
            ]
          }`}
        />
      </div>
      <PostActionsBar
        liked={liked}
        onLike={handleOnLike}
        onComment={() => {
          setCommentPostDetails(postDetails);
          fetchComments();
        }}
      />
      -1
      <div className="flex flex-col gap-2 postCardInfo">
        <span>{`${likesCount} likes`}</span>
        <span>
          <strong>{postDetails.userInfo[0].username} </strong>{" "}
          {postDetails.content}
        </span>
      </div>
    </div>
  );
};
