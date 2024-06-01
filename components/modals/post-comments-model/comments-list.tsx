import { Comment, CommentServices } from "../../../services/CommentServices";
import { SetStateAction, useEffect, useState } from "react";
import { ReplyCommentInfo } from "./add-comment-bar";
import { CommentBox } from "./comment-box";
import clsx from "clsx";
import { Loader } from "../../shared/loaders/clipLoader";
export interface CommentsListProps {
  postId: string;
  setReplyInfo: React.Dispatch<SetStateAction<ReplyCommentInfo | null>>;
  parentComment?: string;
  disableGutters?: boolean;
  updating?: boolean;
  setUpdating?: React.Dispatch<SetStateAction<boolean>>;
}
export const CommentsList = (props: CommentsListProps) => {
  const {
    setReplyInfo,
    postId,
    parentComment,
    disableGutters,
    updating = false,
    setUpdating,
  } = props;

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchComments = () => {
    CommentServices.fetchComments(postId, parentComment)
      .then((resp) => {
        const commentsList = resp.data;
        setComments(commentsList);
        setLoading(false);
        if (setUpdating) setUpdating(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    if (updating) {
      fetchComments();
    }
  }, [updating]);

  return (
    <div
      id="commentsSection"
      className={clsx(" text-sm w-full", {
        ["p-4"]: !disableGutters,
        ["grow overflow-auto commentsList"]: !parentComment,
      })}
    >
      {!loading ? (
        comments.map((comment) => {
          return (
            <div key={comment._id}>
              <CommentBox
                postId={postId}
                comment={comment}
                setReplyInfo={setReplyInfo}
                updating={updating}
              />
            </div>
          );
        })
      ) : (
        <Loader size={parentComment ? 50 : 80} />
      )}
    </div>
  );
};
