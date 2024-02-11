import { IconButton } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { CommentIcon } from "../../icons/comment-icon";
import { HeartIcon } from "../../icons/heart-icon";

import { SaveIcon } from "../../icons/save-icon";
import { ShareIcon } from "../../icons/share-icon";
import { SolidHeartIcon } from "../../icons/solid-heart-icon";
import { PostServices } from "../../services/PostServices";
import { PostDetails } from "../home";

interface PostCardProps {
  postDetails: PostDetails;
}

export const PostCard = (props: PostCardProps) => {
  const { postDetails } = props;

  const [liked, setLiked] = useState<boolean>(postDetails?.isLiked?.length > 0);
  const [likesCount, setLikesCount] = useState<number>(postDetails?.likes || 0);

  const getCreatedAgo = (createdAt) => {
    const currDate = new Date();
    const createdDate = new Date(createdAt);
    const diffSecs = (currDate - createdDate) / 1000;
    if (diffSecs < 60) {
      return "1m";
    } else if (diffSecs > 60 && diffSecs < 60 * 60) {
      return `${Math.floor(diffSecs / 60)}m`;
    } else if (diffSecs >= 60 * 60 && diffSecs < 60 * 60 * 24) {
      return `${Math.floor(diffSecs / (60 * 60))}h`;
    } else if (diffSecs >= 60 * 60 * 24 && diffSecs < 60 * 60 * 24 * 7) {
      return `${Math.floor(diffSecs / (60 * 60 * 24))}d`;
    } else if (
      diffSecs >= 60 * 60 * 24 * 7 &&
      diffSecs < 60 * 60 * 24 * 7 * 4
    ) {
      return `${Math.floor(diffSecs / (60 * 60 * 24 * 7))}w`;
    } else if (
      diffSecs >= 60 * 60 * 24 * 7 * 4 &&
      diffSecs < 60 * 60 * 24 * 7 * 4 * 12
    ) {
      return `${Math.floor(diffSecs / (60 * 60 * 24 * 7 * 4))}m`;
    } else {
      return `${Math.floor(diffSecs / (60 * 60 * 24 * 7 * 4 * 12))}y`;
    }
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
      <div id="postCardMedia" className="postCardMedia">
        <Image alt="Media" src={postDetails.img} width={470} height={585} />
      </div>
      <div
        id="postActions"
        className="flex justify-between items-center postActionsBar"
      >
        <div className="flex items-center">
          <IconButton
            onClick={() => {
              setLiked((prev) => !prev);
              setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
              PostServices.updatePostLikes({
                postId: postDetails._id,
                liked: !liked,
              });
            }}
          >
            {liked ? <SolidHeartIcon /> : <HeartIcon />}
          </IconButton>
          <IconButton>
            <CommentIcon />
          </IconButton>
          <IconButton>
            <ShareIcon />
          </IconButton>
        </div>
        <IconButton>
          <SaveIcon />
        </IconButton>
      </div>
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
