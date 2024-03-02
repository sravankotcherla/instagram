import { IconButton } from "@mui/material";
import { getCreatedAgo } from "../../../helpers/posts";
import { HeartIcon } from "../../../icons/heart-icon";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { ReplyCommentInfo } from "./add-comment-bar";
import { Comment } from "../../../services/CommentServices";
import { CommentsList } from "./comments-list";
import { PostServices } from "../../../services/PostServices";
import { SolidHeartIcon } from "../../../icons/solid-heart-icon";

interface CommentBoxProps {
  postId: string;
  comment: Comment;
  setReplyInfo: React.Dispatch<SetStateAction<ReplyCommentInfo | null>>;
  updating: boolean;
}
export const CommentBox = (props: CommentBoxProps) => {
  const { postId, comment, setReplyInfo, updating } = props;

  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(
    comment.isLiked?.count === 1 ? true : false
  );
  const [likesCount, setLikesCount] = useState<number>(comment.likes || 0);

  const handleCommentLike = (isLike: boolean) => {
    PostServices.updatePostLikes({
      srcId: comment._id,
      liked: isLike,
      type: "comment",
    }).catch((err) => {
      console.log("Failed to like comment", err);
    });
  };

  return (
    <div id="commentBox" className="flex flex-col mb-4">
      <div className="flex flex-row justify-between gap-2">
        <div className="shrink-0">
          <Image
            width={32}
            height={32}
            alt="Content"
            src={comment.createdBy.profileImg || ""}
            className="userDp"
          />
        </div>
        <div className="font-semibold  ml-2 mt-1 grow">
          <span>
            <strong>{comment.createdBy.username} </strong> {comment.text}
          </span>
          <div className="flex items-center gap-2 text-xs secondaryTextColor mt-2">
            <span>{getCreatedAgo(comment.createdAt)}</span>
            <span>{`${likesCount} likes`}</span>
            <span
              onClick={(event) => {
                event.stopPropagation();
                setReplyInfo({
                  commentId: comment._id,
                  text: `@${comment.createdBy.username}`,
                });
              }}
              className="cursor-pointer"
            >
              Reply
            </span>
          </div>
        </div>
        <IconButton
          onClick={(event) => {
            event.stopPropagation();
            handleCommentLike(!liked);
            setLiked((prev) => !prev);
            setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
          }}
        >
          {!liked ? (
            <HeartIcon width={12} height={12} />
          ) : (
            <SolidHeartIcon width={12} height={12} customColor="white" />
          )}
        </IconButton>
      </div>
      <div className="ml-12 mt-4">
        {comment.replyInfo?.replies ? (
          <div
            onClick={(event) => {
              event.stopPropagation();
              setShowReplies((prev) => !prev);
            }}
          >
            {!showReplies ? (
              <span className="text-xs text-secondary cursor-pointer ">{`----- View replies (${comment.replyInfo?.replies})`}</span>
            ) : (
              <div className="flex flex-col gap-4 items-start justify-start">
                <span className="text-xs text-secondary cursor-pointer">
                  ----- Hide Replies
                </span>
                <CommentsList
                  postId={postId}
                  setReplyInfo={setReplyInfo}
                  parentComment={comment._id}
                  updating={updating}
                  disableGutters
                />
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
