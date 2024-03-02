import { IconButton } from "@mui/material";
import { getCreatedAgo } from "../../../helpers/posts";
import { HeartIcon } from "../../../icons/heart-icon";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { ReplyCommentInfo } from "./add-comment-bar";
import { Comment } from "../../../services/CommentServices";
import { CommentsList } from "./comments-list";

interface CommentBoxProps {
  postId: string;
  comment: Comment;
  setReplyInfo: React.Dispatch<SetStateAction<ReplyCommentInfo | null>>;
  updating: boolean;
}
export const CommentBox = (props: CommentBoxProps) => {
  const { postId, comment, setReplyInfo, updating } = props;

  const [showReplies, setShowReplies] = useState<boolean>(false);

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
            <span>{`${comment.likes} likes`}</span>
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
        <IconButton>
          <HeartIcon width={12} height={12} />
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
