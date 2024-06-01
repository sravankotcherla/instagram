import Image from "next/image";
import { Dispatch, SetStateAction, useState } from "react";
import { getCreatedAgo } from "../../helpers/posts";

import { PostServices } from "../../services/PostServices";
import { PostDetails } from "../home";
import { PostActionsBar } from "./post-actions-bar";
import { MediaPlayer } from "./media";

interface PostCardProps {
  postDetails: PostDetails;
  setCommentPostDetails: Dispatch<SetStateAction<PostDetails | null>>;
}

export const PostCard = (props: PostCardProps) => {
  const { postDetails, setCommentPostDetails } = props;

  const [liked, setLiked] = useState<boolean>(postDetails?.isLiked?.length > 0);
  const [likesCount, setLikesCount] = useState<number>(postDetails?.likes || 0);

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
      <MediaPlayer postData={postDetails} />
      <PostActionsBar
        liked={liked}
        onLike={handleOnLike}
        onComment={() => {
          setCommentPostDetails(postDetails);
        }}
      />
      <div className="flex flex-col gap-2 postCardInfo">
        <span>{`${likesCount} ${likesCount <= 1 ? "like" : "likes"}`}</span>
        <span>
          <strong>{postDetails.userInfo[0].username} </strong>{" "}
          {postDetails.content}
        </span>
      </div>
    </div>
  );
};
