import { Comment, CommentServices } from "../../../services/CommentServices";
import { SetStateAction, useEffect, useState } from "react";
import { ReplyCommentInfo } from "./add-comment-bar";
import { CommentBox } from "./comment-box";
import clsx from "clsx";
export interface CommentsListProps {
  postId: string;
  setReplyInfo: React.Dispatch<SetStateAction<ReplyCommentInfo | null>>;
  parentComment?: string;
  disableGutters?: boolean;
}
export const CommentsList = (props: CommentsListProps) => {
  const { setReplyInfo, postId, parentComment, disableGutters } = props;

  const [comments, setComments] = useState<Comment[]>([]);

  const fetchComments = () => {
    CommentServices.fetchComments(postId, parentComment)
      .then((resp) => {
        const commentsList = resp.data;
        setComments(commentsList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div
      id="commentsSection"
      className={clsx(" text-sm", {
        ["p-4"]: !disableGutters,
        ["grow overflow-auto commentsList"]: !parentComment,
      })}
    >
      {comments?.length
        ? comments.map((comment) => {
            return (
              <div key={comment._id}>
                <CommentBox
                  postId={postId}
                  comment={comment}
                  setReplyInfo={setReplyInfo}
                />
              </div>
            );
          })
        : null}
    </div>
  );
};
